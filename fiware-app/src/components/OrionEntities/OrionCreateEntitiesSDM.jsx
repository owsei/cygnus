
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';
import Accordion from 'react-bootstrap/Accordion';
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API
    

export function OrionCreateEntitiesSDM() {
  const toastCenter = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const [orionServices, setOrionServices] = useState([]);

  const [orionServiceSelected, setOrionServiceSelected] = useState('');
  const [orionServicesPathsList, setOrionServicesPathsList] = useState([]);
  

  const [orionServicesPaths, setOrionServicesPaths] = useState([]);
  const [servicePathSelected, setServicePathSelected] = useState('/');

  const [subServicePathText, setsubServicePathText] = useState("");


  const showSuccess = (entityName) => {
      let message = 'Entidad creada:' + entityName ;
      toastCenter.current.show({severity:'success', summary: 'Success', detail:message, life: 2000});
  }
    
  const showError = (error) => {
      let message = 'ERROR:' + error ;
      toastCenter.current.show({severity:'error', summary: 'Error', detail:message, life: 2000});
  }

  const [formData, setFormData] = useState({
    id: "Sensor001",
    type: "WeatherObserved",
    addressLocality: "Pamplona",
    addressCountry: "España",
    addressStreet: "calle Mayor 1",
    latitude: "-1.650768",
    longitude: "42.825969",
    temperature: "9",
    atmosphericPressure: "998",
    relativeHumidity: "88",
    dateObserved: "2025-09-22T10:00:00Z",
    windDirection: "315",
    windSpeed: "2",
  });


  function getOrionServices(){
    axios.get(FAST_API+ "/getOrionServices")
    .then((response) => {
      setOrionServices(response.data)
    })
    .catch((error) => {
      setOrionServices([])
      console.error(error);
      showError(error);
    });
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entity = {
      id: formData.id,
      type: formData.type,
      location: {
        type: "geo:json",
        value: {
          type: "Point",
          coordinates: [
            parseFloat(formData.latitude),
            parseFloat(formData.longitude)
          ],
        }
      },
      temperature: { value: parseFloat(formData.temperature), type: "Number" },
      atmosphericPressure: { value: parseFloat(formData.atmosphericPressure), type: "Number" },
      relativeHumidity: { value: parseFloat(formData.relativeHumidity), type: "Number" },
      dateObserved: { value: formData.dateObserved, type: "DateTime" }
    };

    
    let urlORION=ORION_URL+"/v2/entities";
    // let fiwareService= document.getElementById("fiwareService").value;
    // let fiwareServicePath= document.getElementById("subServicePathText").value;
    if (!servicePathSelected || servicePathSelected.length===0){
      setServicePathSelected('/');
      
    }
    let subservicSelect=document.getElementById("fiwareSubservice").value;
    let subserviceText=document.getElementById("subServicePathText").value;
    if (subserviceText && subserviceText.length>0 && subserviceText!==''){
      if (!subserviceText.startsWith('/')){
        setServicePathSelected('/'+subserviceText);
        subserviceText='/'+subserviceText;
      } 
      else{
        setServicePathSelected(subserviceText);
      }
    }
    
    try {
      const response = await axios.post(
        urlORION, // ⚡ Cambia al host de tu Orion
        entity,
        { headers: { 
            "Content-Type": "application/json",
            "fiware-service": orionServiceSelected,
            "fiware-servicepath": subserviceText
          } 
        }
      );
      
      showSuccess(formData.id);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.description||'Error');
    }
  };

  function buscarSubservicePath(e){
    setOrionServiceSelected(e.target.value);
    let fiwareServiceSDM=document.getElementById("fiwareServiceSDM").value;
    setOrionServicesPaths([]);
    axios.get(FAST_API+ "/getOrionServicesWithServicePath/"+ fiwareServiceSDM)
    .then((response) => {
        setOrionServicesPathsList(response.data);
        getOrionSevicePath(e.target.value);
    })
    .catch((error) => {
      console.error(error);
      setErrorToast(error);
    });
    
  }

  function getOrionSevicePath(service){
    let urlGetServicePath=FAST_API+ "/getOrionServicesPath/"
    if (service || service.length>0){
      urlGetServicePath=FAST_API+ "/getOrionServicesPath/"+ service
    }

    axios.get(urlGetServicePath)
      .then((response) => { 
          setOrionServicesPaths(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorToast(error);
      }); 
  }

  function setServiceParthSelect(e){
    setServicePathSelected(e.target.value);
  }


  async function createModelEntity(){
    let smartDataModelText=document.getElementById("smartDataModel").value;
    let fiwareServiceSDM=document.getElementById("fiwareServiceSDM").value;
    let fiwareSubservice=document.getElementById("fiwareSubservice").value;
    let fiwareSuberviceText=document.getElementById("fiwareSuberviceText").value;

    if (smartDataModelText && smartDataModelText.length>0){

      let entity=JSON.parse(smartDataModelText);

      if (fiwareSuberviceText!='')
        fiwareSubservice=fiwareSuberviceText;

      if (!fiwareSubservice.startsWith('/'))
        fiwareSubservice='/'+fiwareSubservice;
      
      let urlORION=ORION_URL+"/v2/entities";
      try {
        const response = await axios.post(
          urlORION, // ⚡ Cambia al host de tu Orion
          entity,
          { headers: { 
              "Content-Type": "application/json",
              "fiware-service": fiwareServiceSDM,
              "fiware-servicepath": fiwareSubservice
            } 
          }
        );
        
        showSuccess('');
        console.log(response.data);
      } catch (error) {
        console.error(error);
        showError(error?.response?.data?.description||'Error');
      }


    }
  }



  useEffect(() => {
    getOrionServices();
    getOrionSevicePath(orionServiceSelected);
  }, []);

  return (
    <>
      <div className="container mt-4">
        <h2>Crear entidad SDM</h2>
        <br/>
          {orionServiceSelected}
        <div>
           
            <div className="container row align-items-center">
              <div className='row align-items-center' style={{color:"#fff",backgroundColor: '#052841ff', padding: '0px', borderRadius: '5px',height: '60px'}}>
                  <div className='col-2 text-center'>
                      Servicio 
                  </div>
                  <div className='col-2 text-center' >
                      Subservicio
                  </div>
                  <div className='col-2 text-center'>
                      Subservicio (texto)
                  </div>
                  <div className='col-6'></div>
              </div>
              <div className="col-2 text-center" >
              
              </div>
              <div className="col-2 text-center" >
                
              </div>
            </div>
            <div className="row">
              <div className="col-2" >
                <select id="fiwareServiceSDM" class="form-select" aria-label="Servicios" onChange={buscarSubservicePath}>
                    <option value="">Raiz</option>
                    {
                      orionServices.map((service)=>{
                        return (<option value={service}>{service}</option>)
                      })
                    }
                </select>
              </div>
              <div className="col-2" >
                <select id="fiwareSubservice" class="form-select" aria-label="Servicios" onChange={setServiceParthSelect} disabled={subServicePathText.length!=0}>
                    <option value="/">/</option>
                    {
                      orionServicesPaths.map((service)=>{
                        return (<option value={service}>{service}</option>)
                      })
                    }
                </select>
                
              </div>
              <div className="col-2" >
                  <input id="fiwareSuberviceText" type="text" onChange={(e) => setsubServicePathText(e.target.value)}></input>
              </div>
            </div>

          <div className="container row align-items-center">
            <h6>Para la creacion de entidades con smart data model entrar en este <a target="_blank" href="https://smartdatamodels.org/">enlace</a> y copiar/pegar uno  </h6>
          </div>
          <button className="btn btn-primary" onClick={createModelEntity}>Crear Entidad</button>
          <textarea id="smartDataModel" style={{width: '100%', height: '400px', backgroundColor: '#ffffffff', borderRadius: '5px', padding: '10px', fontFamily: 'monospace'}}></textarea>
                    
       
        </div>

      </div>  


      <Toast ref={toastCenter} position="center" />
      
    </>
  )
}


export default OrionCreateEntitiesSDM;

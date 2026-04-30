
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';
import Accordion from 'react-bootstrap/Accordion';
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API
    

export function OrionCreateEntity() {
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
    setOrionServicesPaths([]);
    axios.get(FAST_API+ "/getOrionServicesWithServicePath/"+ e.target.value)
    .then((response) => {
        setOrionServicesPathsList(response.data);
        getOrionSevicePath(e.target.value);
    })
    .catch((error) => {
      setOrionServicesPaths([]);
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


  async function createEntitySmartDataModel(){
    let smartDataModel= document.getElementById("smartDataModel").value;
    let urlORION=ORION_URL+"/v2/entities";
    let fiwareService= document.getElementById("fiwareService").value;
    let fiwareServicePath= document.getElementById("subServicePathText").value;

    let service=orionServiceSelected;
    let subService=servicePathSelected;

    if (subService===''){
      alert('Subservicio no elegido');
    }
      
    let entity=smartDataModel;

    try {
      const response = await axios.post(
        urlORION, // ⚡ Cambia al host de tu Orion
        entity,
        { headers: { 
            "Content-Type": "application/json",
            "fiware-service": service,
            "fiware-servicepath": subService
          } 
        }
      );
      let enti=JSON.stringify(smartDataModel);
      showSuccess(enti.id);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.description||'Error');
    }
  }

  useEffect(() => {
    getOrionServices();
    getOrionSevicePath(orionServiceSelected);
  }, []);

  return (
    <>
      <div className="container">
        <h2>Crear entidad</h2>
        <br/>

        <div>
          <form onSubmit={handleSubmit} className="row g-3">
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
                <select id="fiwareService" class="form-select" aria-label="Servicios" onChange={buscarSubservicePath}>
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
                  <input id="subServicePathText" type="text" onChange={(e) => setsubServicePathText(e.target.value)}></input>
              </div>
            </div>

            <div className="row">
              <div className="col-4" >
                <h6 style={{backgroundColor:"#ffffffff",textShadow:"0px 0px 1px 1px #000"}}>Listado servicios/subservicios:</h6>
                {
                  orionServicesPathsList.map((service)=>{
                    return (<div>{service}</div>)
                  })
                }
              </div>
            </div>
            <hr/>

            <div className="col-md-2">
              <label className="form-label">ID</label>
              <input
                type="text"
                name="id"
                className="form-control"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Tipo</label>
              <input
                type="text"
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12"></div>
            <div className="col-md-2">
              <label className="form-label">Latitud</label>
              <input
                type="number"
                step="any"
                name="latitude"
                className="form-control"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Longitud</label>
              <input
                type="number"
                step="any"
                name="longitude"
                className="form-control"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12"></div>
            <div className="col-md-1">
              <label className="form-label">Temperatura</label>
              <input
                type="number"
                name="temperature"
                className="form-control"
                value={formData.temperature}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Presión atmosférica</label>
              <input
                type="number"
                name="atmosphericPressure"
                className="form-control"
                value={formData.atmosphericPressure}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Humedad relativa</label>
              <input
                type="number"
                name="relativeHumidity"
                className="form-control"
                value={formData.relativeHumidity}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha observada</label>
              <input
                type="datetime-local"
                name="dateObserved"
                className="form-control"
                value={formData.dateObserved}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Crear Entidad
              </button>
            </div>
          </form>
        </div>

      </div>  


          <div className="col-md-3">
            <label className="form-label">Fecha observada</label>
            <input
              type="datetime-local"
              name="dateObserved"
              className="form-control"
              value={formData.dateObserved}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Crear Entidad
            </button>
          </div>

        <hr/>
        <div className="row col-10">
          <div>
                Aqui puedes pegar un smart data model desde aqui <a target="_blank" href="https://smartdatamodels.org/">enlace</a>
          </div>
          <div className="row col-10">
            <textarea name="textarea" id="smartDataModel" rows="10" cols="50"></textarea>
          </div>
          <div className="col-12">
              <button type="button" className="btn btn-primary" onClick={createEntitySmartDataModel}>
                Crear Entidad
              </button>
          </div>
        </div>
      <Toast ref={toastCenter} position="center" />
      
    </>
  )
}


export default OrionCreateEntity;

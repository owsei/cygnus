import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Accordion from 'react-bootstrap/Accordion';
import axios from "axios";
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API


function OrionListSubscriptions() {


  const [orionServices, setOrionServices] = useState([]);
    const [orionSubscriptions, setOrionSubscriptions] = useState([]);
    const [errorToast, setErrorToast] = useState('');

    const [orionServiceSelected, setOrionServiceSelected] = useState([]);
    const [orionServicesPaths, setOrionServicesPaths] = useState([]);
    const [servicePathSelected, setServicePathSelected] = useState('/');

    async function getOrionSubcriptions() {
        let urlORION=ORION_URL+"/v2/subscriptions";

        await axios.get(
            urlORION, // ⚡ Cambia al host de tu Orion
            { headers: { 
                "Content-Type": "application/json",
                "fiware-service": orionServiceSelected,
                "fiware-servicepath": servicePathSelected
                } 
            }
        )
        .then((response)=>{
            setOrionSubscriptions(response.data)
        })
        .catch((error) => {
            setOrionServices([])
            console.error(error);
            setErrorToast(error);
        })
        ;
    }

    function getOrionServices(){
        
        axios.get(FAST_API+ "/getOrionServices")
        .then((response) => {
            
            setOrionServices(response.data)

        })
        .catch((error) => {
            setOrionServices([])
            console.error(error);
            setErrorToast(error);
        });
    }
     
    function buscarSubservicePath(e){
        let fiwareService= e.target.value;
        setOrionServiceSelected(e.target.value);
        setOrionServicesPaths([]);
        axios.get(FAST_API+ "/getOrionServicesPath/"+ fiwareService)
        .then((response) => {
        console.log(response.data);
            setOrionServicesPaths(response.data);
        })
        .catch((error) => {
        console.error(error);
        setErrorToast(error);
        });
    }

    function setServiceParthSelect(e){
        setServicePathSelected(e.target.value)
    }

   useEffect(() => {
    //   OrionEntities();
      getOrionServices();
    }, []);

  return (
    <>
      <div>
        <h2>Listado Subscripciones</h2>
      </div>
      <div className="container">
          <div className="container row align-items-center">
              <div className='row align-items-center' style={{color:"#fff",backgroundColor: '#052841ff', padding: '0px', borderRadius: '5px',height: '60px'}}>
                  <div className='col-2 text-center'>
                      Servicio
                  </div>
                  <div className='col-2 text-center' >
                      Subservicio
                  </div>
                  <div className='col-8'></div>
              </div>
              <div className="col-2 text-center" >
              <select id="fiwareService" class="form-select" aria-label="Servicios" onChange={buscarSubservicePath}>
                  <option value="">Raiz</option>
                  {
                      orionServices.map((service)=>{
                      return (<option value={service}>{service}</option>)
                      })
                  }
              </select>
              </div>
              <div className="col-2 text-center" >
              <select id="fiwareSubservice" class="form-select" aria-label="Servicios" onChange={setServiceParthSelect}>
                  <option value="/">/</option>
                  {
                      orionServicesPaths.map((subservice)=>{
                      return (<option value={subservice}>{subservice}</option>)
                      })
                  }
              </select>
              </div>
              <div className='col-8 text-center justify-content-end' style={{display: 'flex', gap: '10px'}}>
                  <button className='buttonBlue' onClick={getOrionServices}><i class="bi bi-arrow-clockwise"></i></button>
                  <button className='buttonBlue' onClick={getOrionSubcriptions}>Cargar subcriptiones</button>
              </div>
          </div>
          <hr/>
          <h2>Listado de suscripciones</h2>
          
          <div>
              <table className="table table-bordered table-striped">
                  <thead>
                  <tr>
                      <th>ID</th>
                      <th>Description</th>
                      <th>Url</th>
                      <th>Status</th>
                      <th>Last Success Code</th>
                      <th>Last Failure Code</th>
                  </tr>
                  </thead>
                  <tbody>
                  {orionSubscriptions.map((entity) =>
                      <tr key={entity.id}>
                          <td>{entity.id}</td>
                          <td>{entity.description}</td>
                          <td>{entity.notification.http.url||''}</td>
                          <td>{entity.status}</td>
                          <td>{entity.notification?.lastSuccessCode}</td>
                          <td>{entity.notification?.lastSuccess||''}</td>
                      </tr>
                      // })
                  )}
                  </tbody>
              </table>
              <hr/>
              <div>
                  <Accordion>
                      <Accordion.Item eventKey="0" className="custom-accordion-item">
                          <Accordion.Header>Mostrar entidades en Orion</Accordion.Header>
                          <Accordion.Body>
                          {orionSubscriptions.map((subcription) => (
                              <div className='orionCode'>{JSON.stringify(subcription)}</div>
                              
                          ))}
                          </Accordion.Body>
                      </Accordion.Item>
                  </Accordion>
              </div>
          </div>
          {/* Aquí puedes agregar la lógica para listar las entidades */}
      </div>
    </>
  );
}   

export default OrionListSubscriptions;
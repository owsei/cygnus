import React, { useEffect, useState } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from 'react-bootstrap/Toast';
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API



function OrionCreateSevicePath(){
    const [serviceName, setServiceName] = useState('');
    const [orionServices, setOrionServices] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorToast, setErrorToast] = useState('');

    function createService() {
        const serviceNameImput = document.getElementById("serviceName").value;
        axios.post(FAST_API + "/setOrionService/" + serviceNameImput)
            .then((response) => {
                console.log("Service created:", response.data);
                setShowToast(true);
                setServiceName(serviceNameImput)
                console.log(response.data);
                document.getElementById("serviceName").value='';
            })
            .catch((error) => {
                setShowErrorToast(true);
                setErrorToast(error?.code||'Error');  
                console.error("Error creating service:", error);
            });
    }

    function getOrionServices() {
        setErrorToast('')
        console.log(FAST_API+ "/getOrionServices")
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

    function buscasrService(e){
        setServiceSelected(e.target.value);
    }

     useEffect(() => {
          getOrionServices();
        }, []);

    return(
        <>
            <div className='container'>
                <h1>Creacion de Subservicios</h1>
                <p>Creacion de servicios de Orion</p>
                <div>
                    <select id="fiwareService" class="form-select col-2" aria-label="Servicios" onChange={buscasrService}>
                    <option value="/"></option>
                    {orionServices.map((service)=>{
                    return (<option value={service}>{service}</option>)
                    })}
                </select>
                </div>
                <input type="text" id="serviceName" placeholder="Nombre del servicio" /><br/>
                <button className='buttonBlue' onClick={createService} >Crear servicio</button>
            </div>
            
            
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} position="bottom-center" autohide>
                <Toast.Header>
                <strong className="me-auto">Notificación</strong>
                <small>Ahora</small>
                </Toast.Header>
                <Toast.Body>Entidad creada con éxito ✅</Toast.Body>
            </Toast>

            <Toast onClose={() => setShowErrorToast(false)} show={showErrorToast} delay={3000} position="bottom-center" autohide>
                <Toast.Header>
                <strong className="me-auto">Notificación</strong>
                <small>Ahora</small>
                </Toast.Header>
                <Toast.Body>
                Error al crear la entidad ❌
                {errorToast}
                </Toast.Body>
            </Toast>
        </>
    )
}

export default OrionCreateSevicePath;
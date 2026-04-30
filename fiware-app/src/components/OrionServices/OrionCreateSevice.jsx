import React, { useEffect, useState } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from 'primereact/toast';

import OrionListadoSevices from "./OrionListadoSevice";
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API



function OrionCreateServices(){
    const toastCenter = useRef(null);
    const [serviceName, setServiceName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorToast, setErrorToast] = useState('');
    const [orionServices, setOrionServices] = useState([]);

    const showSuccess = (entityId) => {
        let message = 'Data send to ' + entityId + ' IoTAgent';
        toastCenter.current.show({severity:'success', summary: 'Success', detail:message, life: 2000});
    }
    
    const showError = (error) => {
        let message = 'ERROR:' + error ;
        toastCenter.current.show({severity:'error', summary: 'Error', detail:message, life: 2000});
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

    function createService() {
        const serviceNameImput = document.getElementById("serviceName").value;
        axios.post(FAST_API + "/setOrionService/" + serviceNameImput)
            .then((response) => {
                console.log("Service created:", response.data);
                setShowToast(true);
                setServiceName(serviceNameImput)
                console.log(response.data);
                document.getElementById("serviceName").value='';
                getOrionServices();
            })
            .catch((error) => {
                setShowErrorToast(true);
                setErrorToast(error?.code||'Error');  
                console.error("Error creating service:", error);
            });
    }

    useEffect(() => {
        getOrionServices();
    }, []);

    return(
        <>
            <div className='container'>
                <h1>Creación de servicios</h1>
                <p>Creacion de servicios de Orion</p>
                <input type="text" id="serviceName" placeholder="Nombre del servicio" />&nbsp;
                <button className='buttonBlue' onClick={createService} >Crear servicio</button>
                <hr/>
                <div>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>Servicios</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orionServices.map((service) =>
                            <tr key={service}>
                                <td>{service}</td>
                            </tr>
                            // })
                        )}
                        </tbody>
                    </table>
                </div>
                
               <Toast ref={toastCenter} position="center" />
            </div>
        </>
    )
}

export default OrionCreateServices;
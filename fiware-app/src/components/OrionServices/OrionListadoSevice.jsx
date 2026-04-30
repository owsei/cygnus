import React, { useEffect, useState,useRef } from 'react';
import axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import servicio_subservice from '../../assets/servicio_subservice.png';



const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API


function OrionListadoSevice(){
    const toastCenter = useRef(null);
    const [showToast, setShowToast] = useState(false);
    const [orionServices, setOrionServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    

    const showSuccess = (serviceNameImput) => {
        let message = 'Servicio creado:  ' + serviceNameImput ;
        toastCenter.current.show({severity:'success', summary: 'Success', detail:message, life: 2000});
    }
    
    const showError = (error) => {
        let message = 'ERROR:' + error ;
        toastCenter.current.show({severity:'error', summary: 'Error', detail:message, life: 2000});
    }

    function getOrionServices() {
    console.log(FAST_API+ "/getOrionServices")
    axios.get(FAST_API+ "/getOrionServices")
        .then((response) => {
            
            setOrionServices(response.data)

        })
        .catch((error) => {
            setOrionServices([])
            showError('getServices');
            console.error(error);
        });
    }

    function createService() {
        const serviceNameImput = document.getElementById("serviceName").value;
        axios.post(FAST_API + "/setOrionService/" + serviceNameImput)
            .then((response) => {
                console.log("Service created:", response.data);
                showSuccess(serviceNameImput);
                setServiceName(serviceNameImput);
                console.log(response.data);
                document.getElementById("serviceName").value='';
                getOrionServices();
            })
            .catch((error) => {
                showError(serviceNameImput);
                console.error("Error creating service:", error);
            });
    }

    useEffect(() => {
      getOrionServices();
    }, []);



    return(
        <>
            <div className='container '>
                <button label="Show"  className='buttonRed' icon="pi pi-external-link" onClick={() => setModalVisible(true)}> <i class="bi bi-info-circle"></i>  Información</button>
                <Dialog header="Header" visible={modalVisible} style={{ width: '70vw' }} onHide={() => {if (!modalVisible) return; setModalVisible(false); }}>
                    <div className='container-fluid' style={{backgroundColor: "#dfdfdfff"}}>
                        <div className='row'>
                            <div className='col-5 text-justify'>
                                <h2>Servicios y subservicios en <b>Orion</b></h2>
                                <p>Los servicios es la unidad basica de division dentro de <b><i>Orion</i></b> para la ordenación de la información, por cada <b><i>servicio</i></b> se crea una nueva base de datos en <b><i>MongoDB</i></b> siempre con el nombre <b>"orion-servicio"</b> por lo que si por
                                    ejemplo creamos un servicio llamado "pamplona" se generara una base de datos llamada <b>"orion-pamplona"</b>.</p>
                                <p>El objetivo de esta separación es la encapsulación de información.</p>
                                <p>A su vez los servicios pueden tener otra división más los <b>subservicios</b> que en orion son conocidos como <b>"servicePath"</b> que sirven para catalogar dentro de un <b>servicio</b> la información
                                de los diferentes <b>entidades</b> que queramos tener. </p>
                                <p>Una cosa importante es que los <b>subservicios</b> se crean a nivel de <b>entidad</b> en un <b>propiedad</b> que tiene que ir <b>siempre</b> con la entidad. Si no se pone un subservicio dentro de la entidad este campo siempre es una "/" (barra lateral).</p>

                            </div>
                            <div className='col-5'>
                                <img src={servicio_subservice} style={{ width: '38vw' }}/>
                            </div>

                        </div>
                    </div>
                </Dialog>

                
                <Toast ref={toastCenter} position="center" />
                <h1>Listado de servicios</h1>
                <p>Listado de servicios de Orion</p>
                
                <hr/>
                <input type="text" id="serviceName" placeholder="Nombre del servicio" />&nbsp;
                <button className='buttonBlue' onClick={createService} >Crear servicio</button>
                <hr/>
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th>Lista de Servicios <button className='buttonBlue ' onClick={getOrionServices}><i class="bi bi-arrow-clockwise"></i> </button></th>
                    </tr>
                    </thead>
                    <tbody>
                    {orionServices.map((service) =>
                        <tr key={service}>
                            <td>{service}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <hr/>
                
            </div>
        </>
    )
}

export default OrionListadoSevice;
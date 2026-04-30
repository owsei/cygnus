import React, { useEffect, useState,useRef } from 'react';
import axios from "axios";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API


function Configuration() {
     const toastCenter = useRef(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [url_orion, setUrl_orion] = useState(null);
    const [url_iot_json_register, setUrl_iot_json_register] = useState(null);
    const [url_cygnus, setUrl_cygnus] = useState(null);
    const [url_iot_json_data_send, setUrl_iot_json_data_send] = useState(null);
    const [url_iot_ul_register, setUrl_iot_ul_register] = useState(null);
    const [url_iot_ul_data_send, setUrl_iot_ul_data_send] = useState(null);


    function getOrionSetting() {
        // Aquí puedes implementar la lógica para obtener la configuración actual de la apgetOrionSettinglicación
        console.log("Obteniendo configuración de la aplicación...");
        setLoading(true);
        let url_webSettings = FAST_API + "/getOrionWebSettings"
        axios.get(url_webSettings)
            .then((response) => {
                console.log("Configuración obtenida:", response.data) ;
                // Aquí puedes actualizar el estado con la configuración obtenida
                setUrl_orion(response.data[0][0]);
                setUrl_iot_json_register(response.data[0][1]);
                setUrl_iot_json_data_send(response.data[0][2]);
                setUrl_iot_ul_register(response.data[0][3]);
                setUrl_iot_ul_data_send(response.data[0][4]);
                setUrl_cygnus(response.data[0][5]);

                // showSuccess("Configuración cargada correctamente en aplicación: " + response.data[0][0]);
            })
            .catch((error) => {
                console.error("Error obteniendo configuración:", error);
                showError("Error cargando configuración");
            })
            .finally(() => {
                setLoading(false);
            }
        );
    }

    function setOrionSetting() {
        // Aquí puedes implementar la lógica para guardar la configuración actual de la aplicación
        console.log("Guardando configuración de la aplicación...");
        setLoading(true);
        let url_webSettings = FAST_API + "/setOrionWebSettings"
        let data = {
            url_orion: url_orion,
            url_iot_json_register: url_iot_json_register,
            url_iot_json_data_send: url_iot_json_data_send,
            url_iot_ul_register: url_iot_ul_register,
            url_iot_ul_data_send: url_iot_ul_data_send,
            url_cygnus: url_cygnus,
        };
        axios.post(url_webSettings, data)
            .then((response) => {
                console.log("Configuración guardada:", response.data);
                showSuccess("Configuración guardada correctamente en aplicación: " + url_orion);
            })
            .catch((error) => { 
                console.error("Error guardando configuración:", error);
                showError("Error guardando configuración");
            })
            .finally(() => {
                setLoading(false);
            }
        );
    }


    const showSuccess = (serviceNameImput) => {
        let message = 'Servicio creado:  ' + serviceNameImput ;
        toastCenter.current.show({severity:'success', summary: 'Success', detail:message, life: 2000});
    }
    
    const showError = (error) => {
        let message = 'ERROR:' + error ;
        toastCenter.current.show({severity:'error', summary: 'Error', detail:message, life: 2000});
    }

     useEffect(() => {
          getOrionSetting();
    }, []);

    return (
        <>
            <div className="container-fluid">
                <h2>Configuración de la Aplicación</h2>
                <p>Aquí puedes ajustar las configuraciones de la aplicación.</p>

                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Parámetros de Configuración</h5>
                        <p className="card-text">Actualmente no hay parámetros configurables disponibles.</p>
                        <div className='row'>
                            <ProgressSpinner style={{width: '70px', height: '80px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" hidden/>
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL Orion: </label>
                            </div>
                            <div className='col-2'>
                                <input type="text" value={ORION_URL} size={50}/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL IoT JSON Register: </label>
                            </div>
                            <div className='col-2'>
                                <input type="text" value={url_iot_json_register} size={50}></input>
                            </div>  
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL IoT JSON data send: </label>
                            </div>
                            <div className='col-2'>
                                <input type="text" value={url_iot_json_data_send} size={50}></input>
                            </div>  
                        </div>
                        
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL IoT UL Register: </label>
                            </div>
                            <div className='col-2'>  
                                <input type="text" value={url_iot_ul_register}size={50}></input>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL IoT UL Data Send:</label>
                            </div>
                            <div className='col-2'>
                                <input type="text" value={url_iot_json_data_send} size={50}></input>
                            </div>  
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <label>URL Cygnus: </label>
                            </div>
                            <div className='col-3'>  
                                <input type="text" value={url_cygnus} size={50}></input>
                            </div>  
                        </div>
                        <div className='row'>
                            <div className='col-2'>
                                <button className="btn btn-primary" onClick={setOrionSetting}>Guardar configuración</button>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
            <Toast ref={toastCenter} position="center" />
        </>
    );
}
export default Configuration;
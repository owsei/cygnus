import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { Toast } from 'primereact/toast';

const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API



function OrionDeleteEntities(){
    const toastCenter = useRef(null);
    const [orionServices, setOrionServices] = useState([]);
    const [orionEntities, setOrionEntities] = useState([]);
    const [errorToast, setErrorToast] = useState('');

    const [orionServiceSelected, setOrionServiceSelected] = useState([]);
    const [orionServicesPaths, setOrionServicesPaths] = useState([]);
    const [servicePathSelected, setServicePathSelected] = useState('/');

    const showSuccess = (mensaje) => {
        toastCenter.current.show({severity:'success', summary: 'Success', detail:'Entidad borrada:  ' + mensaje, life: 2000});
    }
    
    const showError = (error) => {
        toastCenter.current.show({severity:'error', summary: 'Error', detail:'ERROR:' + error, life: 2000});
    }

    async function getOrionEntities() {
        let urlORION=ORION_URL+"/v2/entities";

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
            setOrionEntities(response.data)
        })
        .catch((error) => {
            setOrionServices([])
            console.error(error);
            showError(error);
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
            showError(error);
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
        showError(error);
        });
    }

    function setServiceParthSelect(e){
        setServicePathSelected(e.target.value)
    }

    function deleteEntity(id)
    {
        let urlDelete=ORION_URL+"/v2/entities/" + id;
        axios.delete(
            urlDelete,
            { headers: { 
                "Content-Type": "application/json",
                "fiware-service": orionServiceSelected,
                "fiware-servicepath": servicePathSelected
                } 
            }
        )
        .then((response) => {
                showSuccess(id);
                getOrionEntities();
            }
        )
        .catch((error) => 
            {
                console.error(error);
                showError(error);
            }
        )
    }
   

    useEffect(() => {
      getOrionServices();
    //   OrionEntities();
    }, []);

    return(
        <div className="container">
            <h3>Listado servicios</h3>
                <div className="container row">
                    <div className="col-2" >
                    <div>Servicio</div>
                    <select id="fiwareService" class="form-select" aria-label="Servicios" onChange={buscarSubservicePath}>
                        <option value="">Raiz</option>
                        {
                            orionServices.map((service)=>{
                            return (<option value={service}>{service}</option>)
                            })
                        }
                    </select>
                    </div>
                    <div className="col-3" >
                    <div>Subservicio</div>
                    <select id="fiwareSubservice" class="form-select" aria-label="Servicios" onChange={setServiceParthSelect}>
                        <option value="/">/</option>
                        {
                            orionServicesPaths.map((subservice)=>{
                            return (<option value={subservice}>{subservice}</option>)
                            })
                        }
                    </select>
                    </div>
                </div>

            <hr/>
            <Toast ref={toastCenter} position="center" />
            <h2>Listado de entidades</h2>
            <div>
                <button className='buttonBlue' onClick={getOrionEntities}>Cargar entidades</button>
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Presión Atmosferica</th>
                        <th>Humedad</th>
                        <th>Temperatura</th>
                        <th>Localización</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orionEntities.map((entity) =>
                        <tr key={entity.id}>
                            <td>{entity.id}</td>
                            <td>{entity.type}</td>
                            <td>{entity.atmosphericPressure?.value||''}</td>
                            <td>{entity.relativeHumidity?.value||''}</td>
                            <td>{entity.temperature?.value||''}</td>
                            <td>{entity.location?.value?.coordinates.map(dat=>dat+" ")}</td>
                            <td><button className='btn btn-danger' onClick={()=>deleteEntity(entity.id)} >Borrar</button></td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )


}


export default OrionDeleteEntities;
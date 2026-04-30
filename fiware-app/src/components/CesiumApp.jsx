import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from 'primereact/toast';
import { Splitter, SplitterPanel } from 'primereact/splitter';

import { Viewer, Entity, PointGraphics, Label, LabelGraphics } from "resium"
import { Cartesian3, Color,AnchorPointDirect } from "cesium"
import * as Cesium from "cesium"

const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API




function CesiumApp() {

    const toastCenter = useRef(null);

    const [orionServices, setOrionServices] = useState([]);
    const [orionEntities, setOrionEntities] = useState([]);

    const [orionServiceSelected, setOrionServiceSelected] = useState([]);
    const [orionServicesPaths, setOrionServicesPaths] = useState([]);
    const [servicePathSelected, setServicePathSelected] = useState('/');

    //CESIUM
    const viewerRef = useRef(null);
    const [entities, setEntities] = useState([])

    // document.getElementById
    // const viewer = new Cesium.Viewer('cesiumContainer');

    const showSuccess = (entityId) => {
        let message = 'Data send to ' + entityId + ' IoTAgent';
        toastCenter.current.show({severity:'success', summary: 'Success', detail:message, life: 1000});
    }
    
    const showError = (error) => {
        let message = 'ERROR:' + error ;
        toastCenter.current.show({severity:'error', summary: 'Error', detail:message, life: 1000});
    }

    async function getOrionEntities() {



        let urlORION=ORION_URL+"/v2/entities";

        let fiwareSubservice= document.getElementById("fiwareSubservice").value;
        let fiwareService= document.getElementById("fiwareService").value;

        await axios.get(
            urlORION, // ⚡ Cambia al host de tu Orion
            { headers: { 
                "Content-Type": "application/json",
                "fiware-service": fiwareService,
                "fiware-servicepath": fiwareSubservice
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
            getOrionEntities();
        })
        .catch((error) => {
        console.error(error);
        showError(error);
        });
    }

    function setServiceParthSelect(e){
        setServicePathSelected(e.target.value)
        getOrionEntities();
    }

    const IotSendData = (entity) => {
        
        let temperature=document.getElementById("temperature"+entity.id).value
        const values = {
            "type": "Number",
            "value": document.getElementById("temperature"+entity.id).value,
        };

        for (const key in values) {
            console.log(`${key}: ${values[key]}`);
        }   


        console.log("Fila modificada:", values);


        let urlPath= ORION_URL+"/v2/entities/"+entity.id+"/attrs/temperature"
        axios.put(
            urlPath,
             values,
            { 
                headers: { 
                    "Content-Type": "application/json",
                    "fiware-service": orionServiceSelected,
                    "fiware-servicepath": servicePathSelected
                } 
            })
        .then((response) => {
            console.log(response.data); 
            showSuccess(entity.id);
            getEntity(entity.id)
            addMapEntity(entity);

            // alert("Datos enviados correctamente al IoT Agent");
        })
        .catch((error) => {
            console.error(error);
            showError(error);
        });

    };

    function getEntity(id){
        let urlPath= ORION_URL+"/v2/entities/"+id
        axios.get(
            urlPath,
            { 
                headers: { 
                    "Content-Type": "application/json",
                    "fiware-service": orionServiceSelected,
                    "fiware-servicepath": servicePathSelected
                } 
            })
        .then((response) => {
            console.log(response.data); 
            showSuccess(response.data.id);
            addMapEntity(response.data);

            // alert("Datos enviados correctamente al IoT Agent");
        })
        .catch((error) => {
            console.error(error);
            showError(error);
        });
    }


    function showDeviceInMap(entityId, temperature) {
        // Aquí iría la lógica para enviar la temperatura al dispositivo real
        let contenerdor= document.getElementById("cesium"+entityId);
        console.log("Mostrar en mapa:", entityId,        );
    }


    const flyToEntity = (longitude, latitude) => {
        const viewer = viewerRef.current.cesiumElement
        viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(longitude, latitude, 5000), // París
        duration: 3
        })
    }

    const flyToNYC = () => {
        const longitude = -74.006;
        const  latitude =  40.7128;

        const newYornEntity = {
            id: "NewYork",
            position: Cartesian3.fromDegrees(longitude,latitude),
            color: Color.fromRandom(),
            longitude:longitude,
            latitude:latitude
        }

        addMapEntity(newYornEntity);

        // viewer.camera.flyTo({
        //     destination: Cartesian3.fromDegrees(longitude,latitude, 2000), // Nueva York
        //     duration: 3, // duración en segundos
        //     orientation: {
        //         heading: Cesium.Math.toRadians(90.0),
        //         pitch: Cesium.Math.toRadians(-30.0),
        //         roll: 0.0
        //     },
        // })
        
        

    }
  
    const flyToParis = () => {
        const longitude = 2.3522;
        const  latitude =  48.8566;
        const ParisEntity = {
            id: "Paris",
            position: Cartesian3.fromDegrees(longitude,latitude),
            color: Color.RED,
            longitude:longitude,
            latitude:latitude
        }
        addMapEntity(ParisEntity);
    }

    const flyToPamplona = () => {
    const viewer = viewerRef.current.cesiumElement
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(-1.65572, 42.815268, 7000), // París
            duration: 3,
            
        })
    }

    const addMapEntity = (entity) => {

        let longitude = null;
        let latitude = null;
        if (entity.longitude==undefined)
        {
            longitude = entity.location.value.coordinates[0];
            latitude = entity.location.value.coordinates[1];
        }
        else{
            longitude = entity.longitude;
            latitude =  entity.latitude;
        }
        
        let positionLine=[];

        
        setEntities((prev) => [...prev, entity])
        const viewer = viewerRef.current.cesiumElement
        viewer.entities.removeAll();
        
        viewer.entities.add({
            description: createPropertiesPanel(entity),
            name: entity.id,
            position: Cartesian3.fromDegrees(longitude, latitude), // Buenos Aires
            point: { pixelSize: 10, color: Color.RED },
            clampToGround: true, // Para que el polígono se ajuste al terreno
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el polígono está en terreno
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        })

        viewer.entities.add({
            name: entity.id,
            position: Cartesian3.fromDegrees(longitude, latitude, 600), 
            label:{ 
                text: entity.id,
                font: "20px Montserrat",
                clampToGround: true, // Para que el polígono se ajuste al terreno
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, // Úsalo si el polígono está en terreno
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        })

        let pointPos=Cartesian3.fromDegrees(longitude, latitude,0);
        let labelPos=Cartesian3.fromDegrees(longitude, latitude,pointPos.z);

        viewer.entities.add({
            description: createPropertiesPanel(entity),
            name: entity.id,
            position: Cartesian3.fromDegrees(longitude, latitude, 600), // Buenos Aires
            label:{ 
                text: entity.id,
                font: "20px Montserrat",
            }
        })

        viewer.entities.add({
            id: 'lineaConector',
            polyline: {
                positions: [pointPos, labelPos],
                width: 2,
                material: Cesium.Color.YELLOW
            }
        });

        flyToEntity(longitude, latitude);
    }

    function crearLinea(pointPos,labelPos) {
        
    }


    function createPropertiesPanel(entity) {
        let descrip = `<table class="tablePorperties">`;
        for (const [key, value] of Object.entries(entity)) {
        if (key === 'enlace'|| key === 'url' || key === 'link' || key === 'source') {
            // Si el valor es un enlace, lo formateamos como un enlace HTML
            descrip = descrip + `<tr class="trproper">
                                    <td>Enlace</td>
                                    <td class="tdproper">
                                    <a href="${value}" target="_blank">Ir a Catastro</a>
                                    </td>
                                </tr>`;
        }
        else{
            if (key === 'id'|| key === 'type' )
                descrip = descrip + `<tr class="trproper">
                                    <td class="tdproper">${key}</td>
                                    <td class="tdproper"> ${value}</td>
                                </tr>`;
            else if(key === 'location')
                descrip = descrip + `<tr class="trproper">
                                    <td class="tdproper">${key}</td>
                                    <td class="tdproper"> ${value.value.coordinates[0]} , ${value.value.coordinates[1]}</td>
                                </tr>`;
            else if (key === 'temperature' || key === 'atmosphericPressure'|| key === 'dateObserved' || key=='relativeHumidity')
                descrip = descrip + `<tr class="trproper">
                                    <td class="tdproper">${key}</td>
                                    <td class="tdproper"> ${value.value}</td>
                                </tr>`;
        }
        
        }
        descrip = descrip + '</table>';
        return descrip;
    }

     useEffect(() => {
        //   OrionEntities();
          getOrionServices();
        }, []);

    return (
        <>
            <h2>Cesium</h2>
            <hr/>
            <div>
                <Splitter style={{ height: '100vh' }}>
                    <SplitterPanel className="flex align-items-left justify-content-left" style={{ minWidth: '300px', maxWidth: '500px' }}>
                        <div className="container-fluid" style={{  }}>
                            <h6>Datos de servicios</h6>
                            <div className="container-fluid row">
                                <div className="col" >
                                    <div>Servicio</div>
                                    <select id="fiwareService" className="form-select" aria-label="Servicios" onChange={buscarSubservicePath}>
                                        <option key={''} value="">/</option>
                                        {
                                            orionServices.map((service)=>{
                                            return (<option key={service} value={service}>{service}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="container-fluid row">
                                <div className="col" >
                                    <div>Subservicio</div>
                                    <select id="fiwareSubservice" className="form-select" aria-label="Servicios" onChange={setServiceParthSelect}>
                                        <option value="/">/</option>
                                        {
                                            orionServicesPaths.map((subservice)=>{
                                            return (<option key={subservice}  value={subservice}>{subservice}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <hr/>
                            <h6>Entidades</h6>
                            <div className="container">
                                <div className="row">
                                    <div className="col" style={{ height: '500px', overflowY: 'scroll' }}>
                                        <table >
                                            {
                                                orionEntities.map((entity) =>{
                                                    return (
                                                        <tbody  key={entity.id}>
                                                            <tr>
                                                                <td>{entity.id}</td>
                                                                <td>{entity.type}</td>
                                                            </tr>
                                                            <tr >
                                                                <td ><input id={"temperature" + entity.id} type="number" defaultValue= {entity.temperature?.value||''}/></td>
                                                                <td ><button className="buttonBlue" onClick={(e) => IotSendData(entity, e)}>Send data</button></td>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                }
                                            )}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Toast ref={toastCenter} position="bottom-right" />
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items- justify-content-left">
                        <div style={{position: "fixed", width: "100%",height: "100%", overflow: "hidden",zIndex: 1000}}>
                                <Viewer ref={viewerRef} full className="cesium-viewer">
                                    {entities.map((e) => (
                                        <Entity key={e.id} position={e.position} name={`Entidad ${e.id}`}>
                                            <PointGraphics pixelSize={10} color={e.color} />
                                            {/* <LabelGraphics
                                                text={e.id}
                                                font="16px sans-serif"
                                                fillColor={Color.WHITE}
                                                outlineColor={Color.BLACK}
                                                outlineWidth={1}
                                                pixelOffset={new Cesium.Cartesian2(0, -20)}
                                            /> */}
                                        </Entity>
                                    ))}
                                </Viewer>
                        </div>
                        <div style={{position: "relative",zIndex: 1000,display: "flex",gap: "10px", height:'50px'}}>
                            <button className="buttonBlue" onClick={flyToNYC}>Volar a Nueva York</button>
                            <button className="buttonBlue" onClick={flyToParis}>Volar a París</button>
                            <button className="buttonBlue" onClick={flyToPamplona}>Volar a Pamplona</button>
                        </div>
                    </SplitterPanel>
                </Splitter>
            </div>


        </>
    
    );
}

export default CesiumApp;
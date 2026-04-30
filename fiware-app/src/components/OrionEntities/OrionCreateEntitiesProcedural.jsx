
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from 'react-bootstrap/Toast';
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API



    

export function OrionCreateEntitiesProcedural() {
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const [orionServices, setOrionServices] = useState([]);

  const [orionServiceSelected, setOrionServiceSelected] = useState('');
  const [orionServicesPathsList, setOrionServicesPathsList] = useState([]);
  

  const [orionServicesPaths, setOrionServicesPaths] = useState([]);
  const [servicePathSelected, setServicePathSelected] = useState();


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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const entity = {
      id: formData.id,
      type: formData.type,
      address: {
        type: "StructuredValue",
        value:{
          addressLocality: { value: formData.addressLocality, type: "Text" },
          addressCountry: { value: formData.addressCountry, type: "Text" },
          addressStreet: { value: formData.addressStreet, type: "Text" }
        }
      },
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
      dateObserved: { value: formData.dateObserved, type: "DateTime" },
      windDirection: { value: parseInt(formData.windDirection), type: "Number" },
      windSpeed: { value: parseFloat(formData.windSpeed), type: "Number" }
    };

    
    let urlORION=ORION_URL+"/v2/entities";
    // let fiwareService= document.getElementById("fiwareService").value;
    let fiwareServicePath= document.getElementById("subServicePathText").value;
    
    try {
      const response = await axios.post(
        urlORION, // ⚡ Cambia al host de tu Orion
        entity,
        { headers: { 
            "Content-Type": "application/json",
            "fiware-service": orionServiceSelected,
            "fiware-servicepath":"/"+fiwareServicePath
          } 
        }
      );
      
      setShowToast(true);

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
      setErrorToast(error?.response?.data?.description||'Error');
    }
  };

  function buscarSubservicePath(e){
    setOrionServiceSelected(e.target.value);
    axios.get(FAST_API+ "/getOrionServicesWithServicePath/")
    .then((response) => {
        setOrionServicesPathsList(response.data);
        
        axios.get(FAST_API+ "/setOrionService/" + orionServiceSelected)
        .then((response) => {
          console.log(response.data);
          setOrionServicesPaths(response.data);
        })
        .catch((error) => {
          console.error(error);
          setErrorToast(error);
        });
    })
    .catch((error) => {
      console.error(error);
      setErrorToast(error);
    });

    
    
  }


  function setServiceParthSelect(e){
    setServicePathSelected(e.target.value);
    document.getElementById("subServicePathText").value=e.target.value;
  }


  const contenedor = document.getElementById('contenedor');
  const btnAgregarRaiz = document.getElementById('agregarRaiz');
  const btnGenerar = document.getElementById('generar');
  const salida = document.getElementById('resultado');

  function crearGrupo(padre) {
      const div = document.createElement('div');
      div.className = 'grupo';
      div.innerHTML = `
        <label>Nombre:</label>
        <input type="text" class="nombre">
        <label>Tipo:</label>
        <input type="text" class="tipo" placeholder="string | number | boolean | object">
        <label>Valor:</label>
        <input type="text" class="valor">
        <div class="hijos"></div>
        <button class="addChild buttonBlue">➕ Añadir hijo</button>
        <button class="remove buttonBlue">❌ Eliminar</button>
        <hr/>
      `;

      // botón añadir hijo
      div.querySelector('.addChild').addEventListener('click', () => {
        crearGrupo(div.querySelector('.hijos'));
      });

      // botón eliminar
      div.querySelector('.remove').addEventListener('click', () => {
        div.remove();
      });

      padre.appendChild(div);
    }

    // Añadir primer grupo raíz
    function crearGrupoRaiz(){
      crearGrupo(contenedor);
    } 

    // Función recursiva para construir JSON
    function construirJSON(grupo) {
      const nombre = grupo.querySelector('.nombre').value || 'sin_nombre';
      const tipo = grupo.querySelector('.tipo').value.trim().toLowerCase();
      let valor = grupo.querySelector('.valor').value;

      const hijos = [...grupo.querySelector('.hijos').children];

      if (tipo === 'object' && hijos.length > 0) {
        // Si es objeto, construir con hijos
        const objeto = {};
        hijos.forEach(hijo => {
          const sub = construirJSON(hijo);
          objeto[sub.nombre] = sub.valor;
        });
        return { nombre, valor: objeto };
      } else {
        // Convertir valor simple según el tipo
        if (tipo === 'number') valor = Number(valor);
        else if (tipo === 'boolean') valor = valor.toLowerCase() === 'true';
        return { nombre, valor };
      }
    }

    // Generar JSON final
    function generarJSON() {
      const grupos = [...contenedor.children];
      const data = {};
      grupos.forEach(grupo => {
        const item = construirJSON(grupo);
        data[item.nombre] = item.valor;
      });
      salida.textContent = JSON.stringify(data, null, 2);
    };

  useEffect(() => {
    getOrionServices();
  }, []);

  return (
    <>
      <div className="container mt-4">
        <h2>Crear entidad</h2>
          
          <div className="row">
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
                    orionServicesPaths.map((service)=>{
                      return (<option value={service}>{service}</option>)
                    })
                  }
              </select>
              <div>
                <input id="subServicePathText" type="text"></input>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-3" >
              <h6 style={{backgroundColor:"#aeaeaeff"}}>Listado:</h6>
              {
                orionServicesPathsList.map((service)=>{
                  return (<div>{service}</div>)
                })
              }
            </div>
          </div>
          <hr/>

          <div className="container">
            <h2>Generador de JSON jerárquico</h2>

            <div id="contenedor"></div>
            <button class="buttonBlue" id="agregarRaiz" onClick={crearGrupoRaiz}>➕ Añadir grupo raíz</button>
            <button class="buttonBlue" id="generar" onClick={generarJSON}>⚡ Generar JSON</button>
            
            <hr/>
            <button class="btn btn-primary" onClick={generarJSON}>Crear entidad en Orion</button>
            <h3>Resultado:</h3>
            <pre id="resultado">{}</pre>

          </div>

          
      </div>
      


      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} position="top-center" autohide>
        <Toast.Header>
          <strong className="me-auto">Notificación</strong>
          <small>Ahora</small>
        </Toast.Header>
        <Toast.Body>Entidad creada con éxito ✅</Toast.Body>
      </Toast>

      <Toast onClose={() => setShowErrorToast(false)} show={showErrorToast} delay={3000} position="top-center" autohide>
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


export default OrionCreateEntitiesProcedural;

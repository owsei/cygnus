
import React, { useEffect, useState,useRef } from 'react';
import Toast from 'react-bootstrap/Toast';
import Accordion from 'react-bootstrap/Accordion';
import axios from "axios";
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API

const exampleSubscription = {
    "description": "A subscription to get info about Room1",
    "subject": {
        "entities": [
            {
                "id": "Room1",
                "type": "Room"    
            }
        ],
        "condition": {
            "attrs": ["temperature","humidity"]
        }
    },  
    "notification": {
        "http": {
            "url": "http://myendpoint.com/notify"
        },    
        "attrs": ["temperature","humidity"]
    },
    "throttling": 5
};


function OrionCreateSubscriptions() {
    
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

    function setSubscription(e){

        setOrionSubscriptions(e.target.value)
    }

   useEffect(() => {
    //   OrionEntities();
      getOrionServices();
    }, []);

    const [baseUrl, setBaseUrl] = useState('http://localhost:1026');
const [service, setService] = useState('pamplona');
const [servicePath, setServicePath] = useState('/iot');
const [output, setOutput] = useState('Pulsa "Listar entidades" o "Listar suscripciones" para empezar.');
const [items, setItems] = useState([]);
const [payload, setPayload] = useState(`{
"description": "Notify Cygnus of changes in IoT Agent Timescale2",
"subject": { "entities": [{ "idPattern": ".*" }] },
"notification": { "http": { "url": "http://draco:5060/notify" } },
"throttling": 0,
"covering": false
}`);


async function fetchOrion(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Fiware-Service'] = service;
  headers['Fiware-ServicePath'] = servicePath;
  if (!headers['Content-Type'] && opts.body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, { ...opts, headers });
  const text = await res.text();
  let data;
  try {
  data = JSON.parse(text);
  } catch {
  data = text;
  }
  return { ok: res.ok, status: res.status, data };
}


function show(obj) {
  setOutput(typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
}


async function listEntities() {
  const r = await fetchOrion('/v2/entities?limit=100');
  show(r);
  if (r.ok && Array.isArray(r.data)) setItems(r.data);
}


async function listSubs() {
  const r = await fetchOrion('/v2/subscriptions');
  show(r);
  if (r.ok && Array.isArray(r.data)) setItems(r.data);
}


async function createSub() {
  const obj = JSON.parse(payload);
  const r = await fetchOrion('/v2/subscriptions', { method: 'POST', body: JSON.stringify(obj) });
  show(r);
  if (r.ok) listSubs();
}

  return (
    <>
      <div>
        <h2>Crear Subscripciones en Orion Context Broker</h2>
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
        <div>
          <textarea class="form-control" id="newOrionSubscription" rows="30" value={JSON.stringify(exampleSubscription, null, 2)} onChange={setSubscription}></textarea>
        </div>
        <div>
          <div className="p-4 max-w-6xl mx-auto space-y-4">
            <h1 className="text-xl font-bold">Gestor FIWARE — Orion (NGSIv2)</h1>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow p-4 space-y-2">
            <h2 className="font-semibold">Conexión</h2>
            <label className="block text-sm">Base URL</label>
            <input className="w-full border p-2 rounded" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
            <label className="block text-sm">Fiware-Service</label>
            <input className="w-full border p-2 rounded" value={service} onChange={e => setService(e.target.value)} />
            <label className="block text-sm">Fiware-ServicePath</label>
            <input className="w-full border p-2 rounded" value={servicePath} onChange={e => setServicePath(e.target.value)} />


            <div className="flex gap-2 mt-3">
            <button onClick={listEntities} className="buttonBlue">Listar entidades</button>
            <button onClick={listSubs} className="buttonBlue">Listar suscripciones</button>
            </div>


            <h2 className="font-semibold mt-4">Suscripción</h2>
            <textarea className="w-full border p-2 rounded text-sm" rows={10} value={payload} onChange={e => setPayload(e.target.value)} />
            <button onClick={createSub} className="buttonBlue">Crear suscripción</button>
            </div>


            <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold">Salida / Respuesta</h2>
            <pre className="bg-gray-900 text-green-200 p-2 rounded text-xs overflow-auto max-h-[400px]">{output}</pre>
            <h3 className="mt-4 font-semibold">Lista</h3>
            <ul className="max-h-[200px] overflow-auto text-sm">
            {items.map((it, i) => (
              <li key={i} className="border-b py-1 flex justify-between">
                <span>{it.id || it.subscriptionId}</span>
                <span className="text-gray-500">{it.type || 'subscription'}</span>
              </li>
            ))}
            </ul>
            </div>
            </div>
            </div>
        </div>
      </div>
      
    </>
  );
}

export default OrionCreateSubscriptions;
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const ORION_URL = import.meta.env.VITE_ORION_URL
const FAST_API = import.meta.env.VITE_FAST_API


function Orion() {
  const [orionVersion, setOrionVersion] = useState('');
  const [orionEntities, setOrionEntities] = useState([]);

  function OrionVersion() {
   axios.get(ORION_URL+"/version")
      .then((response) => setOrionVersion(response.data))
      .catch((error) => console.error(error));
  }

   function OrionEntities() {
   axios.get(ORION_URL+"/v2/entities/")

      .then((response) => setOrionEntities(response.data))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    OrionVersion();
    // OrionEntities();
  }, []);

  return (
    <>
       <div className='container'>
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">
            <h1>Orion Context Broker</h1>
            <p>Gestor de contexto de FIWARE. Permite gestionar el ciclo de vida completo del contexto, incluyendo la actualización, consulta y suscripción a cambios en el mismo.</p>
            <button className='buttonBlue' onClick={OrionVersion}>Orion version</button>
              <pre className='orionCode'>{JSON.stringify(orionVersion, null, 2)}</pre>
              <p>Documentación oficial de Orion Context Broker: <a href="https://fiware-orion.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://fiware-orion.readthedocs.io/en/latest/</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orion;

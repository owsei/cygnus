import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primeicons/primeicons.css';

import Principal from './components/Principal';
import About from './components/About';
import Orion from './components/Orion';
import Cygnus from './components/Cygnus';
import Draco from './components/Draco';
import IoTAgents from './components/IoTAgents';
import Postgres from './components/Postgres';
import OrionEntitiesManagement from './services/OrionEntitiesManagement';
import OrionServicesManagement from './services/OrionServicesManagement';
import IoTAgentServiceManagement from './services/IoTAgentServiceManagement';
import CesiumApp from './components/CesiumApp';
import OrionSubscriptionsManagement from './services/OrionSubscriptionsManagement';
import Configuration from './components/configuration';

function App() {
  return (
    <>

      <div z-index="10000">
        <Router>
          {/* Menú de navegación */}
          <PrimeReactProvider>
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">Fiware</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">Inicio</a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Orion
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="/orion">Orion</a></li>
                      <li><a className="dropdown-item" href="/orionServiceManagement">Gestionar services</a></li>
                      <li><a className="dropdown-item" href="/orionEntityManagement">Gestionar entidades</a></li>
                      <li><a className="dropdown-item" href="/orionSubscriptionsManagement">Gestionar subscripciones</a></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/iotAgentManagement">IoT Agent JSON</a>
                  </li>
                  <li>
                    <a className="nav-link" href="/cesiumApp">Cesium</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/cygnus">Cygnus</a>
                  </li>
                  {/* <li className="nav-item">
                    <a className="nav-link" href="/draco">Draco</a>
                  </li> */}
                  {/* <li className="nav-item">
                    <a className="nav-link" href="/iot-agents">IoT Agents</a>
                  </li> */}
                  <li className="nav-item">
                    <a className="nav-link" href="/postgres">Postgres</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/about">Acerca de</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/configuration"><i class="bi bi-gear-fill"></i> Configuración</a>
                  </li>
                </ul>
              </div>
              
            </div>
          </nav>
          <hr />
          </PrimeReactProvider>
          {/* Definición de rutas */}
            <Routes>
              <Route path="/" element={<Principal />} />
              <Route path="/about" element={<About />} />
              {/* Otras rutas pueden añadirse aquí */}
              <Route path="/orion" element={<Orion />} />
              <Route path="/cygnus" element={<Cygnus />} />
              <Route path="/draco" element={<Draco />} />
              <Route path="/iot-agents" element={<IoTAgents />} />
              <Route path="/postgres" element={<Postgres />} />
              <Route path="/orionEntityManagement" element={<OrionEntitiesManagement />} />
              <Route path="/orionServiceManagement" element={<OrionServicesManagement />} />
              <Route path="/orionSubscriptionsManagement" element={<OrionSubscriptionsManagement />} />
              <Route path="/iotAgentManagement" element={<IoTAgentServiceManagement />} />
              <Route path="/cesiumApp" element={<CesiumApp />} />
              <Route path="/cygnus" element={<Cygnus />} />
              <Route path="/configuration" element={<Configuration />} />
            </Routes>
          </Router>
        </div>

    </>
  )
}

export default App

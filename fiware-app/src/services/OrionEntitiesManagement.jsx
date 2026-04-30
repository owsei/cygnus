
import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { OrionCreateEntity } from "../components/OrionEntities/OrionCreateEntities";
import {OrionListEntities} from "../components/OrionEntities/OrionListEntities";
import OrionDeleteEntities from "../components/OrionEntities/OrionDeleteEntities";
import OrionCreateEntitiesSDM from "../components/OrionEntities/OrionCreateEntitiesSDM";
import OrionCreateEntitiesProcedural from "../components/OrionEntities/OrionCreateEntitiesProcedural";


export function OrionEntitiesManagement() {
  const [tabSelected, setTabSelected] = useState('list');

  return (
    <Tabs id="controlled-tab-example" activeKey={tabSelected} onSelect={(k) => setTabSelected(k)} className="mb-3">
      <Tab eventKey="list" title="Listado de entidades">
        <OrionListEntities />
      </Tab>
      <Tab eventKey="create" title="Crear entidad">
        <OrionCreateEntity />
      </Tab>
      <Tab eventKey="createSDM" title="Crear entidad SDM">
        <OrionCreateEntitiesSDM />
      </Tab>
      <Tab eventKey="createProcedural" title="Crear entidad Procedural">
        <OrionCreateEntitiesProcedural />
      </Tab>
      
      <Tab eventKey="delete" title="Borrar entidad">
        <OrionDeleteEntities/>
      </Tab>
    </Tabs>
  );
}

export default OrionEntitiesManagement;



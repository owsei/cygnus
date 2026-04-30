
import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OrionCreateSubscriptions from "../components/OrionSubscriptions/OrionCreateSubscriptions";
import OrionListSubscriptions from "../components/OrionSubscriptions/OrionListSubscriptions";
import OrionDeleteSubscriptions from "../components/OrionSubscriptions/OrionDeleteSubscriptions";


export function OrionSubscriptionsManagement() {
  const [tabSelected, setTabSelected] = useState('list');

  return (
    <Tabs id="controlled-tab-example" activeKey={tabSelected} onSelect={(k) => setTabSelected(k)} className="mb-3">
      <Tab eventKey="list" title="Listado de subscripciones">
        <OrionListSubscriptions />
      </Tab>
      <Tab eventKey="create" title="Crear subscripción">
        <OrionCreateSubscriptions />
      </Tab>
      <Tab eventKey="delete" title="Borrar subscripción">
        <OrionDeleteSubscriptions/>
      </Tab>
    </Tabs>
  );
}

export default OrionSubscriptionsManagement;



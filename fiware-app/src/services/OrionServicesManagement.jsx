
import React, { useState } from "react";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OrionCreateServices from "../components/OrionServices/OrionCreateSevice";
import OrionListadoSevice from "../components/OrionServices/OrionListadoSevice";


export function OrionServicesManagement() {
  const [tabSelected, setTabSelected] = useState('home');

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={tabSelected}
      onSelect={(k) => setTabSelected(k)}
      className="mb-3 " 
    >
      <Tab eventKey="home" title="Listado de servicios">
        <OrionListadoSevice />
      </Tab>
    </Tabs>
  );
}

export default OrionServicesManagement;


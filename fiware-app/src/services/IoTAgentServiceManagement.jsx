
import React, { useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import IotAgentSendData from "../components/IoTAgent/IotAgentSendData";


export function IoTAgentServiceManagement() {
  const [tabSelected, setTabSelected] = useState('list');

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={tabSelected}
      onSelect={(k) => setTabSelected(k)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Enviar datos">
        <IotAgentSendData/>
      </Tab>
      {/* <Tab eventKey="create" title="Crear dispositivo">
      </Tab> */}
    </Tabs>
  );
}

export default IoTAgentServiceManagement;




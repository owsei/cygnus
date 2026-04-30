import React, { useEffect, useState } from 'react';
import axios from "axios";
const ORION_URL = import.meta.env.VITE_ORION_URL


function OrionDeleteSevice(){

    return(
        <>
            <h1>Borrado Service</h1>
            <p>Borrado de servicios de Orion</p>
        </>
    )
}

export default OrionDeleteSevice;
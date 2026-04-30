import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

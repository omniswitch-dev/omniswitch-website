import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Telemetry from './components/Telemetry.jsx'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App url={location.pathname + location.search + location.hash} />
    <Telemetry />
  </StrictMode>
)
if (root.hasChildNodes() && root.querySelector('main')) hydrateRoot(root, app)
else createRoot(root).render(app)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CustomerInspectionForm from './CustomerInspectionForm.jsx'
import { registerSW } from 'virtual:pwa-register'
registerSW({ onNeedRefresh() {}, onOfflineReady() {} })

const isInspectRoute = window.location.pathname === '/inspect' ||
                       window.location.search.includes('id=');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isInspectRoute ? <CustomerInspectionForm /> : <App />}
  </React.StrictMode>
)

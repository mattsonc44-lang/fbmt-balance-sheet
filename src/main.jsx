import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CustomerInspectionForm from './CustomerInspectionForm.jsx'
import { registerSW } from 'virtual:pwa-register'
// Force clear any stale service worker caches on load
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => {
      r.update(); // check for new SW version
    });
  });
}
registerSW({ onNeedRefresh() { window.location.reload(); }, onOfflineReady() {} })

const isInspectRoute = window.location.pathname === '/inspect' ||
                       window.location.search.includes('id=');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isInspectRoute ? <CustomerInspectionForm /> : <App />}
  </React.StrictMode>
)

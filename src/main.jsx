import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Sidenav from './components/Sidenav';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
ReactDOM.createRoot(document.getElementById('sidenav')).render(
  <React.StrictMode>
    <Sidenav />
  </React.StrictMode>,
)
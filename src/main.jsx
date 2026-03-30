import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'DM Sans', borderRadius: '12px' },
        success: { iconTheme: { primary: '#F5C400', secondary: '#0A3C45' } }
      }} />
    </BrowserRouter>
  </React.StrictMode>
)

// main.jsx bootstraps the React application into the DOM.
import React from 'react'
import ReactDOM from 'react-dom/client'
// Import the root component to render.
import App from './App.jsx'
// Global styles applied throughout the app.
import './index.css'

// Create the React root and render the application inside StrictMode for extra checks.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

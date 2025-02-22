import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find root element. Make sure there is a DOM element with id 'root'");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { SnackbarProvider } from "notistack";

import './App.css'
import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <App />
    </SnackbarProvider>
  </StrictMode>,
)

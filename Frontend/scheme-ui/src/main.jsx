import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {UserProvider} from './context/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
    
    <UserProvider>
       <Toaster position="top-right mt-20" />
      <App />
    </UserProvider>
     </BrowserRouter>
  </StrictMode>,
)

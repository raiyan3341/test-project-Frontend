import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { 
    RouterProvider,
 } from "react-router";
import { router } from './Routes/Routes.jsx';
import Authprovider from './components/context/Authprovider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>,
)
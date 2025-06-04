import React from "react";  
import ReactDOM from "react-dom/client";  
import AppRouter from "./router";
import './styles/index.css'; // Asegúrate de que este archivo exista y tenga estilos básicos  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>  
    {/* Envuelve la aplicacion con el RouterProvider*/}
    <AppRouter />  
  </React.StrictMode>  
);  
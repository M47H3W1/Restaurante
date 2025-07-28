import React from "react";
import "./ModalMensaje.css";

function ModalMensaje({ abierto, mensaje, onClose }) {
  if (!abierto) return null;
  return (
    <div className="ModalMensaje-overlay">
      <div className="ModalMensaje-contenido">
        <div className="ModalMensaje-texto">{mensaje}</div>
        <button className="ModalMensaje-boton" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default ModalMensaje;
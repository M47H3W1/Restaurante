import React from "react";
import "./ModalMensaje.css";

function ModalMensaje({ abierto, mensaje, onClose, botones }) {
  if (!abierto) return null;
  return (
    <div className="ModalMensaje-overlay">
      <div className="ModalMensaje-contenido">
        <div className="ModalMensaje-texto">{mensaje}</div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          {botones
            ? botones
            : <button className="ModalMensaje-boton" onClick={onClose}>Cerrar</button>
          }
        </div>
      </div>
    </div>
  );
}

export default ModalMensaje;
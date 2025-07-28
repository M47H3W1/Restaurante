import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navegador.css";

function Navegador() {
  const navigate = useNavigate();
  return (
    <nav className="Navegador">
      <div className="Navegador-logo" onClick={() => navigate("/")}>🍽️ RestauranteApp</div>
      <div className="Navegador-links">
        <Link to="/lista">Restaurantes</Link>
        <Link to="/tipos">Tipos</Link>
      </div>
      <div className="Navegador-auth">
        <Link to="/login" className="Navegador-btn">Iniciar sesión</Link>
        <Link to="/register" className="Navegador-btn secundario">Registrarse</Link>
      </div>
    </nav>
  );
}

export default Navegador;

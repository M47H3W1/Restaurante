import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navegador.css";

function Navegador() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload del token:", payload);
        setUsuario(payload.userName || payload.email || "Usuario");
      } catch {
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav className="Navegador">
      <div className="Navegador-logo" onClick={() => navigate("/")}>🍽️ RestauranteApp</div>
      <div className="Navegador-links">
        <Link to="/lista">Restaurantes</Link>
        <Link to="/tipos">Tipos</Link>
      </div>
      <div className="Navegador-auth">
        {!usuario ? (
          <>
            <Link to="/login" className="Navegador-btn">Iniciar sesión</Link>
            <Link to="/register" className="Navegador-btn secundario">Registrarse</Link>
          </>
        ) : (
          <>
            <span className="Navegador-usuario">{usuario}</span>
            <button className="Navegador-btn secundario" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navegador;

import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(ENDPOINTS.LOGIN, { email, password });
      localStorage.setItem("token", res.data.token);
      setAuth({ user: res.data, token: res.data.token });
      setMensaje("");
      // Recarga la página para que se actualice el navegador
      navigate("/");
      window.location.reload();
      
    } catch (err) {
      setMensaje("Credenciales inválidas");
    }
  };

  return (
    <div className="LoginContainer">
      <form className="LoginForm" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        {mensaje && <div className="mensaje">{mensaje}</div>}
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        <button
          type="button"
          className="register-link"
          onClick={() => navigate("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}

export default Login;
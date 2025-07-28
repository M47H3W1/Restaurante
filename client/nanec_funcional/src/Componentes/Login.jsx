import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";
import { useNavigate } from "react-router-dom";

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
      setMensaje("Login exitoso");
      navigate("/lista");
    } catch (err) {
      setMensaje("Credenciales inválidas");
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <button onClick={() => navigate("/register")}>Registrarse</button>
    </div>
  );
}

export default Login;
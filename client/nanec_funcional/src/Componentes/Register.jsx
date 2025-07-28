import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(ENDPOINTS.REGISTER, { userName, email, password });
      setMensaje("Registro exitoso, ahora puedes iniciar sesión");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMensaje("Error al registrar usuario");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nombre de usuario" value={userName} onChange={e => setUserName(e.target.value)} required />
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Register;
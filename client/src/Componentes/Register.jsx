import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Usa el nuevo archivo de estilos

function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    try {
      await axios.post(ENDPOINTS.REGISTER, { userName, email, password });
      setMensaje("Registro exitoso, ahora puedes iniciar sesión");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMensaje("Error al registrar usuario");
    }
  };

  return (
    <div className="RegisterContainer">
      <form className="RegisterForm" onSubmit={handleRegister}>
        <h2>Registro</h2>
        {mensaje && <div className="mensaje">{mensaje}</div>}
        <label htmlFor="username">Nombre de usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
        <div className="input-group">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <div className="input-group">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit">Registrarse</button>
        <button
          type="button"
          className="register-link"
          onClick={() => navigate("/login")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </form>
    </div>
  );
}

export default Register;
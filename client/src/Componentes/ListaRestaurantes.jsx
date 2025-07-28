import Restaurante from './Restaurante';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import './ListaRestaurantes.css';
import ModalMensaje from './ModalMensaje';

function ListaRestaurantes({
  restaurantes, 
  handleEliminar,
  obtenerRestaurantes
}) {
  const [tiposPorRestaurante, setTiposPorRestaurante] = useState({});
  const [confirmarAbierto, setConfirmarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [nombreRestauranteEliminar, setNombreRestauranteEliminar] = useState("");

  useEffect(() => {
    // Por cada restaurante, obtener sus tipos
    async function fetchTipos() {
      const tiposMap = {};
      await Promise.all(restaurantes.map(async (restaurante) => {
        try {
          const res = await axios.get(`${ENDPOINTS.MENU}/restaurante/${restaurante._id || restaurante.id}`);
          tiposMap[restaurante._id || restaurante.id] = res.data.map(tipo => tipo.nombre || tipo.tipo || tipo);
        } catch (e) {
          tiposMap[restaurante._id || restaurante.id] = [];
        }
      }));
      setTiposPorRestaurante(tiposMap);
    }
    if (restaurantes.length > 0) fetchTipos();
  }, [restaurantes]);

  // Función para generar las estrellas basadas en la reputación
  const generarEstrellas = (reputacion) => {
    const numReputacion = parseInt(reputacion) || 0;
    const maxEstrellas = 5;
    let estrellas = '';
    
    // Agregar estrellas llenas
    for (let i = 0; i < Math.min(numReputacion, maxEstrellas); i++) {
      estrellas += '⭐';
    }
    
    // Agregar estrellas vacías si es necesario
    for (let i = numReputacion; i < maxEstrellas; i++) {
      estrellas += '☆';
    }
    
    return estrellas;
  };

  const [mensajeErrorLikesNegativos, setMensajeErrorLikesNegativos] = useState("");
  const [likes, setLikes] = useState(0); // Contador único de likes

  const SumarLikes = () => setLikes((prev) => prev + 1);

  const RestarLikes = () => {
    if (likes <= 0) {
      mensajeErrorLikesNegativo("No se puede tener likes negativos");
      return;
    }
    setLikes((prev) => prev - 1);
  };

  const mensajeErrorLikesNegativo = (mensaje) => {
    setMensajeErrorLikesNegativos(mensaje);
    setTimeout(() => setMensajeErrorLikesNegativos(""), 3000);
  };

  const navigate = useNavigate();

  const handleInicio = () => {
    navigate("/");  
  }

  const handleCrear = () => {
    navigate("/crear");
  }

  // Función para abrir el modal de confirmación
  const confirmarEliminar = (restaurante) => {
    setIdAEliminar(restaurante.id);
    setNombreRestauranteEliminar(restaurante.nombre);
    setConfirmarAbierto(true);
  };

  return (
    <div className="ListaRestaurantes">
      <button onClick={handleInicio}>Volver al Inicio</button>
      <br />
      <button onClick={handleCrear}>Crear nuevo restaurante</button>
      <br />
      
      <h1>Likes totales: {likes}</h1>
      {mensajeErrorLikesNegativos && (
        <h2 style={{ color: "red" }}>{mensajeErrorLikesNegativos}</h2>
      )}
      
      {restaurantes.map((restaurante, index) => (
        <div className="RestauranteCard" key={restaurante.id || index}>
          <img src={restaurante.UrlImagen || restaurante.url} alt={restaurante.nombre} />
          <div className="RestauranteCard-content">
            <div className="RestauranteCard-header">
              <span className="RestauranteCard-nombre">{restaurante.nombre}</span>
              <span className="RestauranteCard-tipo">{tiposPorRestaurante[restaurante.id] || []}</span>
            </div>
            <div className="RestauranteCard-direccion">{restaurante.direccion}</div>
            <div className="RestauranteCard-reputacion">
              Reputación: {generarEstrellas(restaurante.reputacion)} ({restaurante.reputacion}/5)
            </div>
            <div className="RestauranteCard-actions">
              <button className="eliminar" onClick={() => confirmarEliminar(restaurante)}>Eliminar</button>
              <button className="actualizar">Actualizar</button>
            </div>
            <div className="RestauranteCard-likes">
              <button className="like-btn" onClick={SumarLikes}>👍</button>
              <button className="dislike-btn" onClick={RestarLikes}>👎</button>
              <span>Likes: {likes}</span>
            </div>
          </div>
        </div>
      ))}

      <ModalMensaje
        abierto={confirmarAbierto}
        mensaje={`¿Estás seguro de que deseas eliminar el restaurante "${nombreRestauranteEliminar}"?`}
        onClose={() => setConfirmarAbierto(false)}
        botones={
          <>
            <button
              className="ModalMensaje-boton"
              onClick={() => {
                setConfirmarAbierto(false);
                handleEliminar(idAEliminar);
                setIdAEliminar(null);
                setNombreRestauranteEliminar("");
              }}
            >
              Eliminar
            </button>
            <button
              className="ModalMensaje-boton"
              style={{ background: "#444" }}
              onClick={() => {
                setConfirmarAbierto(false);
                setIdAEliminar(null);
                setNombreRestauranteEliminar("");
              }}
            >
              Cancelar
            </button>
          </>
        }
      />
    </div>
  );
}

export default ListaRestaurantes;
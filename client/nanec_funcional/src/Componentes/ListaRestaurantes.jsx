import Restaurante from './Restaurante';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';

function ListaRestaurantes({
  restaurantes, 
  handleEliminar,
  obtenerRestaurantes
}) {
  const [tiposPorRestaurante, setTiposPorRestaurante] = useState({});

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

  const [mensajeErrorLikesNegativos, setMensajeErrorLikesNegativos] = useState("");
  const [likesTotales, setLikesTotales] = useState(0);
  
  const SumarLikes = () => setLikesTotales((prev) => prev + 1);

  const RestarDislikes = () => {
    if (likesTotales <= 0) {
      mensajeErrorLikesNegativo("No se puede restar más likes");
      return;
    }
    setLikesTotales((prev) => prev - 1);
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

  return (
    <div className="ListaRestaurantes">
      <button onClick={handleInicio}>Volver al Inicio</button>
      <br />
      <button onClick={handleCrear}>Crear nuevo restaurante</button>
      <br />
      
      <h1>Cantidad likes: {likesTotales}</h1>
      {mensajeErrorLikesNegativos && (
        <h2 style={{ color: "red" }}>{mensajeErrorLikesNegativos}</h2>
      )}
      
      {restaurantes.map((restaurante, index) => (
        <Restaurante
          key={restaurante._id || restaurante.id || index}
          id={restaurante._id || restaurante.id}
          nombre={restaurante.nombre}
          direccion={restaurante.direccion}
          tipos={tiposPorRestaurante[restaurante._id || restaurante.id] || []} // <-- pasa los tipos
          reputacion={restaurante.reputacion}
          UrlImagen={restaurante.UrlImagen || restaurante.url}
          SumarLikes={SumarLikes}
          RestarDislikes={RestarDislikes}
          mensajeErrorLikesNegativo={mensajeErrorLikesNegativo}
          index={index}
          handleEliminar={handleEliminar}
        />
      ))}
    </div>
  );
}

export default ListaRestaurantes;
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
  const navigate = useNavigate();
  const [tiposPorRestaurante, setTiposPorRestaurante] = useState({});
  const [confirmarAbierto, setConfirmarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [nombreRestauranteEliminar, setNombreRestauranteEliminar] = useState("");

  useEffect(() => {
    // Por cada restaurante, obtener sus tipos
    async function fetchTipos() {
      if (restaurantes.length === 0) {
        setTiposPorRestaurante({});
        return;
      }

      const tiposMap = {};
      
      // Crear promesas para todos los restaurantes válidos
      const promesas = restaurantes
        .filter(restaurante => restaurante.id || restaurante._id) // Solo restaurantes con ID válido
        .map(async (restaurante) => {
          const restauranteId = restaurante._id || restaurante.id;
          try {
            const res = await axios.get(`${ENDPOINTS.MENU}`);
            // Filtrar menús que pertenecen a este restaurante
            const menusDelRestaurante = res.data.filter(menu => 
              String(menu.restaurante_id || menu.restauranteId) === String(restauranteId)
            );
            
            // Obtener los tipos de comida para estos menús
            const tiposPromesas = menusDelRestaurante.map(async (menu) => {
              try {
                const tipoRes = await axios.get(`${ENDPOINTS.TIPO_COMIDA}/${menu.tipoComidaId}`);
                return tipoRes.data.nombre || tipoRes.data.tipo || menu.tipoComidaId;
              } catch (e) {
                console.warn(`No se pudo obtener tipo ${menu.tipoComidaId}:`, e);
                return `Tipo ${menu.tipoComidaId}`;
              }
            });
            
            const tipos = await Promise.all(tiposPromesas);
            tiposMap[restauranteId] = tipos;
          } catch (e) {
            console.warn(`Error al obtener menús para restaurante ${restauranteId}:`, e);
            tiposMap[restauranteId] = [];
          }
        });

      // Ejecutar todas las promesas
      await Promise.all(promesas);
      setTiposPorRestaurante(tiposMap);
    }
    
    fetchTipos();
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

  const handleInicio = () => {
    navigate("/");  
  }

  const handleCrear = () => {
    navigate("/crear");
  }

  // Función para abrir el modal de confirmación
  const confirmarEliminar = (restaurante) => {
    const id = restaurante.id || restaurante._id;
    console.log("ID del restaurante a eliminar:", id); // Para debuggear
    console.log("Restaurante completo:", restaurante); // Para debuggear
    
    if (!id) {
      console.error("No se encontró ID válido para el restaurante:", restaurante);
      return;
    }
    
    setIdAEliminar(id);
    setNombreRestauranteEliminar(restaurante.nombre);
    setConfirmarAbierto(true);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem("token");
  };

  return (
    <div className="ListaRestaurantes">
      <button onClick={handleInicio}>Volver al Inicio</button>
      <br />
      
      {/* Solo mostrar botón de crear si está autenticado */}
      {isAuthenticated() && (
        <>
          <button onClick={handleCrear}>Crear nuevo restaurante</button>
          <br />
        </>
      )}
      
      <h1>Likes totales: {likes}</h1>
      {mensajeErrorLikesNegativos && (
        <h2 style={{ color: "red" }}>{mensajeErrorLikesNegativos}</h2>
      )}
      
      {restaurantes.map((restaurante, index) => (
        <div className="RestauranteCard" key={restaurante.id || restaurante._id || index}>
          <img src={restaurante.UrlImagen || restaurante.url} alt={restaurante.nombre} />
          <div className="RestauranteCard-content">
            <div className="RestauranteCard-header">
              <span className="RestauranteCard-nombre">{restaurante.nombre}</span>
              
              {/* Contenedores individuales para cada tipo */}
              <div className="RestauranteCard-tipos">
                {(tiposPorRestaurante[restaurante.id || restaurante._id] || []).map((tipo, tipoIndex) => (
                  <span 
                    key={tipoIndex} 
                    className={`RestauranteCard-tipo tipo-${tipoIndex % 6}`}
                  >
                    {tipo}
                  </span>
                ))}
              </div>
            </div>
            <div className="RestauranteCard-direccion">{restaurante.direccion}</div>
            <div className="RestauranteCard-reputacion">
              Reputación: {generarEstrellas(restaurante.reputacion)} ({restaurante.reputacion}/5)
            </div>
            
            {/* Solo mostrar botones de acción si está autenticado */}
            {isAuthenticated() && (
              <div className="RestauranteCard-actions">
                <button className="eliminar" onClick={() => confirmarEliminar(restaurante)}>Eliminar</button>
                <button className="actualizar" onClick={() => navigate(`/actualizar/${restaurante.id || restaurante._id}`)}>Actualizar</button>
              </div>
            )}
            
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
                console.log("ID a eliminar en el modal:", idAEliminar); // Para debuggear
                if (!idAEliminar) {
                  console.error("ID a eliminar es null/undefined");
                  return;
                }
                
                setConfirmarAbierto(false);
                handleEliminar(idAEliminar);
                setIdAEliminar(null);
                setNombreRestauranteEliminar("");
                // ✅ Recarga la lista después de eliminar
                if (obtenerRestaurantes) {
                  obtenerRestaurantes();
                }
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
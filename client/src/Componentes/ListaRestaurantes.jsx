import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import './ListaRestaurantes.css';
import ModalMensaje from './ModalMensaje';
import Select from 'react-select';

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

  const [tipos, setTipos] = useState([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [tipoAAgregar, setTipoAAgregar] = useState(""); // Nuevo estado
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState(restaurantes);
  const [busquedaTipo, setBusquedaTipo] = useState(""); // Nuevo estado para búsqueda

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

  // Obtener tipos de comida
  useEffect(() => {
    axios.get(ENDPOINTS.TIPO_COMIDA)
      .then(res => setTipos(res.data))
      .catch(() => setTipos([]));
  }, []);

  // Filtrar restaurantes cuando cambian los tipos seleccionados
  useEffect(() => {
    if (tiposSeleccionados.length === 0) {
      setRestaurantesFiltrados(restaurantes);
      return;
    }
    axios.get(`http://localhost:8000/restaurantesByTipos?tipos=${tiposSeleccionados.join(',')}`)
      .then(res => setRestaurantesFiltrados(res.data))
      .catch(() => setRestaurantesFiltrados([]));
  }, [tiposSeleccionados, restaurantes]);

  // Opciones para el select de tipos
  const opcionesTipos = tipos
    .filter(tipo => !tiposSeleccionados.includes(String(tipo.id || tipo._id)))
    .map(tipo => ({
      value: String(tipo.id || tipo._id),
      label: tipo.nombre || tipo.tipo
    }));

  // Para mostrar los chips seleccionados:
  const tiposSeleccionadosObj = tipos.filter(t => tiposSeleccionados.includes(String(t.id || t._id)));

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
      
      {/* Nueva sección para filtrar por tipo de restaurante */}
      <div style={{ width: "100%", marginBottom: 16 }}>
        <label style={{ fontWeight: 600 }}>Filtrar por tipo de restaurante:</label>
        <Select
          classNamePrefix="react-select"
          options={opcionesTipos}
          isMulti
          placeholder="Buscar o seleccionar tipo..."
          value={tipos
  .filter(tipo => tiposSeleccionados.includes(String(tipo.id || tipo._id)))
  .map(tipo => ({
    value: String(tipo.id || tipo._id),
    label: tipo.nombre || tipo.tipo
  }))
}
          onChange={selected => {
            setTiposSeleccionados(selected ? selected.map(opt => opt.value) : []);
          }}
          styles={{
            container: base => ({ ...base, width: 250, marginLeft: 12, marginBottom: 8 }),
            menu: base => ({ ...base, zIndex: 9999 })
          }}
          noOptionsMessage={() => "Sin resultados"}
          isClearable={false}
          closeMenuOnSelect={false}
        />
        <div style={{ marginTop: 8 }}>
          {tiposSeleccionadosObj.map((tipo, idx) => (
            <span
              key={tipo.id || tipo._id}
              className={`RestauranteCard-tipo tipo-${idx % 6}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginRight: "8px",
                marginBottom: "4px",
                padding: "6px 14px 6px 14px",
                borderRadius: "20px",
                fontSize: "15px",
                position: "relative"
              }}
            >
              {tipo.nombre || tipo.tipo}
              <span
                style={{
                  marginLeft: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#fff",
                  background: "#e57373",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Quitar filtro"
                onClick={() => {
                  setTiposSeleccionados(tiposSeleccionados.filter(id => id !== String(tipo.id || tipo._id)));
                }}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      </div>
      
      {restaurantesFiltrados.length === 0 ? (
  <div style={{ color: "#fff", fontWeight: 600, margin: "32px 0", fontSize: "1.2rem" }}>
    Ups, sentimos que no tenemos restaurantes de este tipo.
  </div>
) : (
  restaurantesFiltrados.map((restaurante, index) => (
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
  ))
)}

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
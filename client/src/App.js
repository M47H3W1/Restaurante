import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ListaRestaurantes from "./Componentes/ListaRestaurantes";
import CrearRestaurante from "./Componentes/CrearRestaurante";
import ComponenteAxios from './Componentes/ComponeteAxios';
import Inicio from './Componentes/Inicio';
import ActualizarRestaurante from './Componentes/ActualizarRestaurante';
import Login from './Componentes/Login';
import Register from './Componentes/Register';
import ListaTipoComida from "./Componentes/ListaTipoComida";
import Navegador from "./Componentes/Navegador";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from './config/endpoints';

function App() {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem("token") || null
  });

  // Axios interceptor para agregar token a cada request
  React.useEffect(() => {
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);

  const [restaurantes, setRestaurantes] = useState([]);

  const obtenerRestaurantes = async () => {
    const res = await axios.get(ENDPOINTS.RESTAURANTES);
    setRestaurantes(res.data);
  };

  // Llama a obtenerRestaurantes cuando se monta la lista
  useEffect(() => {
    obtenerRestaurantes();
  }, []);


  //Se agrega un nuevo restaurante al servidor
  const agregarRestauranteAxios = (nuevoRestaurante) => {
    axios.post(ENDPOINTS.RESTAURANTES, nuevoRestaurante)
      .then(response => { setRestaurantes(prev => [...prev, response.data]) })
      .catch(error => console.error('Error al agregar el restaurante:', error))
  };
  //Se elimina un restaurante del servidor
  const eliminarRestaurante = async (id) => {
    if (!id) {
      console.error("ID de restaurante no válido:", id);
      return;
    }
    
    try {
      console.log("Eliminando restaurante con ID:", id);
      await axios.delete(`${ENDPOINTS.RESTAURANTES}/${id}`);
      
      // Actualizar la lista local después de eliminar
      setRestaurantes(prev => prev.filter(r => (r.id || r._id) !== id));
      
      console.log("Restaurante eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar restaurante:", error);
    }
  };

  //Se actualiza un restaurante en el servidor
  const actualizarRestaurante = (restauranteActualizado) => {
    axios.put(`${ENDPOINTS.RESTAURANTES}/${restauranteActualizado.id}`, restauranteActualizado)
      .then(response => {
        setRestaurantes(prev => prev.map(restaurante =>
          restaurante.id === restauranteActualizado.id ? response.data : restaurante
        ));
      })
      .catch(error => console.error('Error al actualizar el restaurante:', error));
  }

  const [state, setState] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    reputacion: "",
    UrlImagen: "",
  });

  const agregarRestaurante = (nuevoRestaurante) => {
    agregarRestauranteAxios(nuevoRestaurante);
  };

  // Rutas protegidas
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    // Usar auth para verificar si está autenticado
    return (token && auth.token) ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navegador />
        <Routes>
          {/* Rutas públicas - no requieren autenticación */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Visualización pública de restaurantes y tipos */}
          <Route
            path="/lista"
            element={
              <ListaRestaurantes
                restaurantes={restaurantes}
                handleEliminar={eliminarRestaurante}
                obtenerRestaurantes={obtenerRestaurantes}
              />
            }
          />
          <Route path="/tipos" element={<ListaTipoComida />} />
          <Route path="/axios" element={<ComponenteAxios />} />

          {/* Rutas protegidas - requieren autenticación */}
          <Route
            path='/crear'
            element={
              <PrivateRoute>
                <CrearRestaurante 
                  agregarRestaurante={agregarRestaurante}
                  obtenerRestaurantes={obtenerRestaurantes}
                />
              </PrivateRoute>
            }
          />
          <Route 
            path='/actualizar/:id' 
            element={
              <PrivateRoute>
                <ActualizarRestaurante
                  state={state}
                  setState={setState}
                  actualizarRestaurante={actualizarRestaurante}
                  obtenerRestaurantes={obtenerRestaurantes}
                />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


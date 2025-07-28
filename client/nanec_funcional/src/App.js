import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ListaRestaurantes from "./Componentes/ListaRestaurantes";
import CrearRestaurante from "./Componentes/CrearRestaurante";
import ComponenteAxios from './Componentes/ComponeteAxios';
import Inicio from './Componentes/Inicio';
import ActualizarRestaurante from './Componentes/ActualizarRestaurante';
import Login from './Componentes/Login';
import Register from './Componentes/Register';
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
  //Se cargan los restaurantes desde el servidor
  const obtenerRestaurantesAxios = () => {
    axios.get(ENDPOINTS.RESTAURANTES)
      .then(response => setRestaurantes(response.data))
      .catch(error => console.error('Error al obtener los restaurantes:', error));
  };

  //Se agrega un nuevo restaurante al servidor
  const agregarRestauranteAxios = (nuevoRestaurante) => {
    axios.post(ENDPOINTS.RESTAURANTES, nuevoRestaurante)
      .then(response => { setRestaurantes(prev => [...prev, response.data]) })
      .catch(error => console.error('Error al agregar el restaurante:', error))
  };
  //Se elimina un restaurante del servidor
  const eliminarRestauranteAxios = (id) => {
    axios.delete(`${ENDPOINTS.RESTAURANTES}/${id}`)
      .then(() => {
        setRestaurantes(prev => prev.filter(restaurante => restaurante.id !== id));
      })
      .catch(error => console.error('Error al eliminar el restaurante:', error));
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

  const eliminarRestaurante = (index) => {
    eliminarRestauranteAxios(restaurantes[index].id);
  };

  // Rutas protegidas
  const PrivateRoute = ({ children }) => {
    return auth.token ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
          <Route path='/crear' element={
            <PrivateRoute>
              <CrearRestaurante
                state={state}
                setState={setState}
                agregarRestaurante={agregarRestaurante}
              />
            </PrivateRoute>
          } />
          <Route path='/actualizar/:id' element={
            <PrivateRoute>
              <ActualizarRestaurante
                state={state}
                setState={setState}
                actualizarRestaurante={actualizarRestaurante}
              />
            </PrivateRoute>
          } />
          <Route
            path="/lista"
            element={
              <PrivateRoute>
                <ListaRestaurantes
                  restaurantes={restaurantes}
                  handleEliminar={eliminarRestaurante}
                  obtenerRestaurantes={obtenerRestaurantes}
                />
              </PrivateRoute>
            }
          />
          <Route path="/axios" element={<ComponenteAxios />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



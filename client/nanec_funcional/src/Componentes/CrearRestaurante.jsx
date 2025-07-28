import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import "./FormularioRestaurante.css";

function CrearRestaurante (props){
    const [tipos, setTipos] = useState([]);
    // Estado local para cada campo
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [tipo, setTipo] = useState("");
    const [reputacion, setReputacion] = useState("");
    const [UrlImagen, setUrlImagen] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(ENDPOINTS.TIPO_COMIDA)
            .then(res => setTipos(res.data))
            .catch(err => setTipos([]));
    }, []);

    const handlerInsertar = (e) => {
        e.preventDefault(); // <-- Esto previene el doble envío
        const nuevoRestaurante = {
            nombre,
            direccion,
            reputacion,
            url: UrlImagen
        };

        axios.post(ENDPOINTS.RESTAURANTES, nuevoRestaurante)
            .then(res => {
                const restauranteCreado = res.data.data;
                const restauranteId = restauranteCreado._id || restauranteCreado.id;
                if (!restauranteId) {
                    alert("No se pudo obtener el ID del restaurante creado. Revisa la respuesta del backend.");
                    throw new Error("ID de restaurante no encontrado en la respuesta");
                }
                const registroMenu = {
                    restaurante_id: restauranteId,
                    tipoComidaId: tipo
                };
                return axios.post(ENDPOINTS.MENU, registroMenu);
            })
            .then(() => {
                alert("Restaurante y menú creados exitosamente");
                if (props.agregarRestaurante) props.agregarRestaurante({ nombre, direccion, reputacion, url: UrlImagen });
                // Limpia los campos
                setNombre("");
                setDireccion("");
                setTipo("");
                setReputacion("");
                setUrlImagen("");
            })
            .catch(err => {
                alert("Error al crear restaurante o menú");
                console.error(err);
            });
    }

    return (    
        <form className="FormularioRestaurante" onSubmit={handlerInsertar}>
            <button type="button" onClick={() => navigate("/")}>Volver al Inicio</button>
            <button type="button" onClick={() => navigate("/lista")}>Ver lista</button>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
            <label>Dirección:</label>
            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} />
            <label>Tipo:</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo, idx) => (
                    <option key={idx} value={tipo.id || tipo._id}>
                        {tipo.nombre || tipo.tipo || tipo}
                    </option>
                ))}
            </select>
            <label>Reputación:</label>
            <input type="number" value={reputacion} onChange={e => setReputacion(e.target.value)} />
            <label>URL Imagen:</label>
            <input type="text" value={UrlImagen} onChange={e => setUrlImagen(e.target.value)} />
            <button type="submit">Insertar</button>
        </form>  
    );      
}

export default CrearRestaurante;
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import "./FormularioRestaurante.css";

function CrearRestaurante (props){
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        axios.get(ENDPOINTS.TIPO_COMIDA)
            .then(res => setTipos(res.data))
            .catch(err => setTipos([]));
    }, []);

    const handlerInsertar = () => {
        const nuevoRestaurante = {
            nombre: props.state.nombre,
            direccion: props.state.direccion,
            reputacion: props.state.reputacion,
            url: props.state.UrlImagen
        };

        axios.post(ENDPOINTS.RESTAURANTES, nuevoRestaurante)
            .then(res => {
                console.log("📦 Respuesta al crear restaurante:", res.data);
                const restauranteCreado = res.data.data;
                const restauranteId = restauranteCreado._id || restauranteCreado.id;
                if (!restauranteId) {
                    alert("No se pudo obtener el ID del restaurante creado. Revisa la respuesta del backend.");
                    throw new Error("ID de restaurante no encontrado en la respuesta");
                }
                const registroMenu = {
                    restaurante_id: restauranteId,
                    tipoComidaId: props.state.tipo
                };
                console.log("📝 Registro de menú a insertar:", registroMenu);
                return axios.post(ENDPOINTS.MENU, registroMenu);
            })
            .then(() => {
                alert("Restaurante y menú creados exitosamente");
                props.agregarRestaurante(nuevoRestaurante);
                props.setState({nombre:"", direccion:"", tipo:"", reputacion:"", UrlImagen:""});
            })
            .catch(err => {
                alert("Error al crear restaurante o menú");
                console.error(err);
            });
    }

    const navigate = useNavigate();

    const handleInicio = () => {
        navigate("/");
    }

    const handleLista = () => {
        navigate("/lista");
    }

    return (    
        <div className="FormularioRestaurante">
            <button onClick={handleInicio}>Volver al Inicio</button>
            <button onClick={handleLista}>Ver lista</button>
            <label>Nombre:</label>
            <input type="text" value={props.state.nombre} onChange={(e) => props.setState({...props.state, nombre: e.target.value})} />
            <label>Dirección:</label>
            <input type="text" value={props.state.direccion} onChange={(e) => props.setState({...props.state, direccion: e.target.value})} />
            <label>Tipo:</label>
            <select
                value={props.state.tipo}
                onChange={(e) => props.setState({ ...props.state, tipo: e.target.value })}
            >
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo, idx) => (
                    <option key={idx} value={tipo.id || tipo._id}>
                        {tipo.nombre || tipo.tipo || tipo}
                    </option>
                ))}
            </select>
            <label>Reputación:</label>
            <input type="number" value={props.state.reputacion} onChange={(e) => props.setState({...props.state, reputacion: e.target.value})} />
            <label>URL Imagen:</label>
            <input type="text" value={props.state.UrlImagen} onChange={(e)=> props.setState({...props.state,UrlImagen: e.target.value})}/>
            <button onClick={handlerInsertar}>Insertar</button>
        </div>  
    );      
}

export default CrearRestaurante;
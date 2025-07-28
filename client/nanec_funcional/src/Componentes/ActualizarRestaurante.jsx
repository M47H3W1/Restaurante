import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./ActualizarRestaurante.css";
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';

function ActualizarRestaurante(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imagenError, setImagenError] = useState(false);

    // Solo se ejecuta cuando cambia el id
    useEffect(() => {
        cargarRestaurante();
    }, [id]);

    const cargarRestaurante = () => {
        if (!id) {
            console.error("No se recibió un id válido para actualizar.");
            return;
        }
        console.log("Cargando restaurante con id:", id);
        axios.get(`${ENDPOINTS.RESTAURANTES}/${id}`)
            .then(response => {
                console.log("📦 Datos del restaurante:", response.data);
                const restaurante = response.data;
                
                // Validar que el restaurante existe
                if (!restaurante) {
                    console.error("❌ No se encontró el restaurante");
                    return;
                }
                
                props.setState({
                    id: restaurante._id || restaurante.id, // para que el formulario siempre tenga id
                    nombre: restaurante.nombre || "",
                    direccion: restaurante.direccion || "",
                    tipo: restaurante.tipo || "",
                    reputacion: restaurante.reputacion || "",
                    UrlImagen: restaurante.UrlImagen || restaurante.url || ""
                });
            })
            .catch(error => {
                console.error('❌ Error al obtener el restaurante:', error);
                console.error('📋 Error response:', error.response?.data);
                console.error('🔢 Status code:', error.response?.status);
            });
    };

    const handlerGuardar = () => {
        if (!props.state.nombre || !props.state.direccion || !props.state.tipo) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        const restauranteActualizado = {
            _id: id, // Cambia id por _id
            nombre: props.state.nombre.trim(),
            direccion: props.state.direccion.trim(),
            tipo: props.state.tipo,
            reputacion: parseInt(props.state.reputacion) || 1,
            url: props.state.UrlImagen.trim() || ""
        };

        props.actualizarRestaurante(restauranteActualizado);
        alert("Restaurante actualizado exitosamente");
        props.setState({ nombre: "", direccion: "", tipo: "", reputacion: "", UrlImagen: "" });
        navigate("/lista");
    };

    const handleInicio = () => {
        navigate("/");
    };

    const handleLista = () => {
        navigate("/lista");
    };

    return (
        <div className="ActualizarRestaurante">
            <button onClick={handleInicio}>Volver al Inicio</button>
            <br />
            <button onClick={handleLista}>Ver lista</button>
            <br />

            <label>Nombre:</label>
            <input type="text" value={props.state.nombre} onChange={(e) => props.setState({ ...props.state, nombre: e.target.value })} />
            <label>Dirección:</label>
            <input type="text" value={props.state.direccion} onChange={(e) => props.setState({ ...props.state, direccion: e.target.value })} />
            <label>Tipo:</label>
            <select
                value={props.state.tipo}
                onChange={(e) => props.setState({ ...props.state, tipo: e.target.value })}
            >
                <option value="">Seleccione un tipo</option>
                <option value="Tradicional">Tradicional</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Desayunos">Desayunos</option>
                <option value="Vegana">Vegana</option>
                <option value="Vegetariana">Vegetariana</option>
            </select>
            <label>Reputación:</label>
            <input type="number" value={props.state.reputacion} onChange={(e) => props.setState({ ...props.state, reputacion: e.target.value })} />
            <label>URL Imagen:</label>
            <input
                type="text"
                value={props.state.UrlImagen}
                onChange={e => {
                    props.setState({ ...props.state, UrlImagen: e.target.value });
                    setImagenError(false); // Resetear error al cambiar URL
                }}
                onFocus={e => e.target.select()}
            />
            
            {props.state.UrlImagen && !imagenError && (
                <div style={{ margin: "10px 0" }}>
                    <img
                        src={props.state.UrlImagen}
                        alt="Vista previa"
                        style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px", border: "1px solid #ccc" }}
                        onError={() => setImagenError(true)}
                    />
                </div>
            )}
            {imagenError && (
                <div style={{
                    width: "200px",
                    height: "150px",
                    background: "#f8d7da",
                    color: "#721c24",
                    border: "1px solid #f5c6cb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    margin: "10px 0"
                }}>
                    No se pudo cargar la imagen
                </div>
            )}

            <button onClick={handlerGuardar}>Guardar</button>
        </div>
    );
}

export default ActualizarRestaurante;
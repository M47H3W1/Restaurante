import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import "./FormularioRestaurante.css";
import ModalMensaje from "./ModalMensaje";

function CrearRestaurante (props){
    const [tipos, setTipos] = useState([]);
    // Estado local para cada campo
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [tiposSeleccionados, setTiposSeleccionados] = useState([]); // Array para múltiples tipos
    const [reputacion, setReputacion] = useState("");
    const [UrlImagen, setUrlImagen] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMensaje, setModalMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(ENDPOINTS.TIPO_COMIDA)
            .then(res => setTipos(res.data))
            .catch(() => setTipos([]));
    }, []);

    const handleTiposChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setTiposSeleccionados(selectedOptions);
    };

    const handlerInsertar = (e) => {
        e.preventDefault(); // <-- Esto previene el doble envío
        if (!nombre.trim() || !direccion.trim() || tiposSeleccionados.length === 0 || !reputacion.trim()) {
            setModalMensaje("Por favor, complete todos los campos y seleccione al menos un tipo.");
            setModalAbierto(true);
            return;
        }
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
                    setModalMensaje("No se pudo obtener el ID del restaurante creado. Revisa la respuesta del backend.");
                    setModalAbierto(true);
                    throw new Error("ID de restaurante no encontrado en la respuesta");
                }
                // Crea un registro de menú por cada tipo seleccionado
                return Promise.all(
                    tiposSeleccionados.map(tipoId =>
                        axios.post(ENDPOINTS.MENU, {
                            restaurante_id: restauranteId,
                            tipoComidaId: tipoId
                        })
                    )
                );
            })
            .then(() => {
                setModalMensaje("Restaurante y tipos creados exitosamente");
                setModalAbierto(true);
                
                // Limpia los campos
                setNombre("");
                setDireccion("");
                setTiposSeleccionados([]);
                setReputacion("");
                setUrlImagen("");
            })
            .catch(err => {
                setModalMensaje("Error al crear restaurante o menú");
                setModalAbierto(true);
                console.error(err);
            });
    }

    return (
        <>
            <form className="FormularioRestaurante" onSubmit={handlerInsertar}>
                <button type="button" onClick={() => navigate("/")}>Volver al Inicio</button>
                <button type="button" onClick={() => navigate("/lista")}>Ver lista</button>
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                <label>Dirección:</label>
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} />
                <label>Tipos:</label>
                <select
                    multiple
                    value={tiposSeleccionados}
                    onChange={handleTiposChange}
                    style={{ minHeight: "80px" }}
                >
                    {tipos.map((tipo) => (
                        <option key={tipo.id || tipo._id} value={String(tipo.id || tipo._id)}>
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
            <ModalMensaje
                abierto={modalAbierto}
                mensaje={modalMensaje}
                onClose={() => {
                    setModalAbierto(false);
                    if (modalMensaje.includes("exitosamente")) {
                        // ✅ Recarga la lista después de crear
                        if (props.obtenerRestaurantes) {
                            props.obtenerRestaurantes();
                        }
                        navigate("/lista");
                    }
                }}
            />
        </>
    );      
}

export default CrearRestaurante;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./FormularioRestaurante.css";
import axios from "axios";
import { ENDPOINTS } from '../config/endpoints';
import ModalMensaje from "./ModalMensaje";

function ActualizarRestaurante(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imagenError, setImagenError] = useState(false);
    const [tipos, setTipos] = useState([]); // Lista de tipos disponibles
    const [tiposSeleccionados, setTiposSeleccionados] = useState([]); // Tipos seleccionados del restaurante
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalMensaje, setModalMensaje] = useState("");
    const [restaurante, setRestaurante] = useState({
        nombre: "",
        direccion: "",
        reputacion: "",
        UrlImagen: ""
    });

    // Cargar tipos disponibles al montar el componente
    useEffect(() => {
        axios.get(ENDPOINTS.TIPO_COMIDA)
            .then(res => setTipos(res.data))
            .catch(() => setTipos([]));
    }, []);

    // Cargar datos del restaurante cuando cambia el id
    useEffect(() => {
        if (!id) return;

        const cargarRestaurante = () => {
            axios.get(`${ENDPOINTS.RESTAURANTES}/${id}`)
                .then(response => {
                    const data = response.data;
                    setRestaurante({
                        nombre: data.nombre || "",
                        direccion: data.direccion || "",
                        reputacion: data.reputacion || "",
                        UrlImagen: data.UrlImagen || data.url || ""
                    });
                })
                .catch(error => {
                    console.error('Error al obtener el restaurante:', error);
                    setModalMensaje("Error al cargar los datos del restaurante");
                    setModalAbierto(true);
                });
        };

        const cargarTiposDelRestaurante = () => {
            console.log("Cargando tipos para restaurante ID:", id);
            axios.get(`${ENDPOINTS.MENU}`)
                .then(res => {
                    console.log("Todos los menús:", res.data);
                    const menusDelRestaurante = res.data.filter(menu => 
                        String(menu.restaurante_id || menu.restauranteId) === String(id)
                    );
                    console.log("Menús del restaurante:", menusDelRestaurante);
                    const tiposIds = menusDelRestaurante.map(item => String(item.tipoComidaId));
                    console.log("Tipos IDs seleccionados:", tiposIds);
                    setTiposSeleccionados(tiposIds);
                })
                .catch(error => {
                    console.error('Error al cargar tipos del restaurante:', error);
                    setTiposSeleccionados([]);
                });
        };

        // Ejecutar las funciones
        cargarRestaurante();
        cargarTiposDelRestaurante();
    }, [id]);

    const handlerGuardar = () => {
        if (!restaurante.nombre.trim() || 
            !restaurante.direccion.trim() || 
            tiposSeleccionados.length === 0 || 
            !restaurante.reputacion || 
            restaurante.reputacion < 1 || 
            restaurante.reputacion > 5) {
            setModalMensaje("Por favor, complete todos los campos y seleccione al menos un tipo. La reputación debe estar entre 1 y 5.");
            setModalAbierto(true);
            return;
        }

        const restauranteActualizado = {
            nombre: restaurante.nombre.trim(),
            direccion: restaurante.direccion.trim(),
            reputacion: parseInt(restaurante.reputacion) || 1,
            url: (restaurante.UrlImagen || "").trim()
        };

        console.log("Iniciando actualización del restaurante...");

        // Paso 1: Actualizar restaurante
        axios.put(`${ENDPOINTS.RESTAURANTES}/${id}`, restauranteActualizado)
            .then(() => {
                console.log("Restaurante actualizado, gestionando relaciones de tipos...");
                // Paso 2: Obtener relaciones actuales
                return axios.get(`${ENDPOINTS.MENU}`);
            })
            .then(response => {
                const menusExistentes = response.data.filter(menu => 
                    String(menu.restaurante_id || menu.restauranteId) === String(id)
                );
                
                const tiposExistentes = menusExistentes.map(menu => String(menu.tipoComidaId));
                const tiposNuevos = tiposSeleccionados.map(tipo => String(tipo));
                
                console.log("Tipos existentes:", tiposExistentes);
                console.log("Tipos nuevos seleccionados:", tiposNuevos);
                
                // Encontrar tipos a eliminar (están en existentes pero no en nuevos)
                const tiposAEliminar = tiposExistentes.filter(tipo => !tiposNuevos.includes(tipo));
                // Encontrar tipos a agregar (están en nuevos pero no en existentes)
                const tiposAAgregar = tiposNuevos.filter(tipo => !tiposExistentes.includes(tipo));
                
                console.log("Tipos a eliminar:", tiposAEliminar);
                console.log("Tipos a agregar:", tiposAAgregar);
                
                const promesas = [];
                
                // Eliminar relaciones que ya no se necesitan
                if (tiposAEliminar.length > 0) {
                    const menusAEliminar = menusExistentes.filter(menu => 
                        tiposAEliminar.includes(String(menu.tipoComidaId))
                    );
                    
                    menusAEliminar.forEach(menu => {
                        const menuId = menu.id || menu._id;
                        console.log("Eliminando relación:", menuId, "tipo:", menu.tipoComidaId);
                        promesas.push(
                            axios.delete(`${ENDPOINTS.MENU}/${menuId}`)
                                .then(() => console.log("Relación eliminada:", menuId))
                                .catch(error => {
                                    console.error("Error al eliminar relación:", menuId, error);
                                    throw error;
                                })
                        );
                    });
                }
                
                // Agregar nuevas relaciones
                if (tiposAAgregar.length > 0) {
                    tiposAAgregar.forEach(tipoId => {
                        console.log("Creando nueva relación para tipo:", tipoId);
                        promesas.push(
                            axios.post(ENDPOINTS.MENU, {
                                restaurante_id: parseInt(id),
                                tipoComidaId: parseInt(tipoId)
                            })
                            .then(() => console.log("Nueva relación creada para tipo:", tipoId))
                            .catch(error => {
                                console.error("Error al crear relación para tipo:", tipoId, error);
                                throw error;
                            })
                        );
                    });
                }
                
                // Si no hay cambios en las relaciones
                if (promesas.length === 0) {
                    console.log("No hay cambios en las relaciones de tipos");
                    return Promise.resolve();
                }
                
                return Promise.all(promesas);
            })
            .then(() => {
                console.log("Actualización completada exitosamente");
                setModalMensaje("Restaurante actualizado exitosamente");
                setModalAbierto(true);
            })
            .catch(error => {
                console.error('Error completo al actualizar:', error);
                console.error('Respuesta del servidor:', error.response?.data);
                setModalMensaje("Error al actualizar el restaurante: " + (error.response?.data?.message || error.message));
                setModalAbierto(true);
            });
    };

    const handleInicio = () => {
        navigate("/");
    };

    const handleLista = () => {
        navigate("/lista");
    };

    const handleTiposChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setTiposSeleccionados(selectedOptions);
    };

    return (
        <>
            <div className="FormularioRestaurante">
                <div className="FormularioRestaurante-header">
                    <button className="FormularioRestaurante-btn" onClick={handleInicio}>Volver al Inicio</button>
                    <button className="FormularioRestaurante-btn" onClick={handleLista}>Ver lista</button>
                </div>

                <h2 className="FormularioRestaurante-titulo">Actualizar Restaurante</h2>

                <form className="FormularioRestaurante-form">
                    <div className="FormularioRestaurante-campo">
                        <label className="FormularioRestaurante-label">Nombre:</label>
                        <input 
                            className="FormularioRestaurante-input"
                            type="text" 
                            value={restaurante.nombre} 
                            onChange={(e) => setRestaurante({ ...restaurante, nombre: e.target.value })} 
                        />
                    </div>
                    
                    <div className="FormularioRestaurante-campo">
                        <label className="FormularioRestaurante-label">Dirección:</label>
                        <input 
                            className="FormularioRestaurante-input"
                            type="text" 
                            value={restaurante.direccion} 
                            onChange={(e) => setRestaurante({ ...restaurante, direccion: e.target.value })} 
                        />
                    </div>
                    
                    <div className="FormularioRestaurante-campo">
                        <label className="FormularioRestaurante-label">Tipos:</label>
                        <select
                            className="FormularioRestaurante-select"
                            multiple
                            value={tiposSeleccionados}
                            onChange={handleTiposChange}
                        >
                            {tipos.map((tipo) => (
                                <option key={tipo.id || tipo._id} value={String(tipo.id || tipo._id)}>
                                    {tipo.nombre || tipo.tipo || tipo}
                                </option>
                            ))}
                        </select>
                        <small className="FormularioRestaurante-help">Mantén Ctrl/Cmd presionado para seleccionar múltiples tipos</small>
                    </div>
                    
                    <div className="FormularioRestaurante-campo">
                        <label className="FormularioRestaurante-label">Reputación:</label>
                        <input 
                            className="FormularioRestaurante-input"
                            type="number" 
                            min="1" 
                            max="5" 
                            value={restaurante.reputacion} 
                            onChange={(e) => setRestaurante({ ...restaurante, reputacion: e.target.value })} 
                        />
                    </div>
                    
                    <div className="FormularioRestaurante-campo">
                        <label className="FormularioRestaurante-label">URL Imagen:</label>
                        <input
                            className="FormularioRestaurante-input"
                            type="text"
                            value={restaurante.UrlImagen}
                            onChange={e => {
                                setRestaurante({ ...restaurante, UrlImagen: e.target.value });
                                setImagenError(false);
                            }}
                            onFocus={e => e.target.select()}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        
                        {restaurante.UrlImagen && !imagenError && (
                            <div className="FormularioRestaurante-preview">
                                <img
                                    src={restaurante.UrlImagen}
                                    alt="Vista previa"
                                    className="FormularioRestaurante-imagen"
                                    onError={() => setImagenError(true)}
                                />
                            </div>
                        )}
                        {imagenError && (
                            <div className="FormularioRestaurante-error">
                                No se pudo cargar la imagen
                            </div>
                        )}
                    </div>

                    <button 
                        className="FormularioRestaurante-submit" 
                        type="button"
                        onClick={handlerGuardar}
                    >
                        Actualizar Restaurante
                    </button>
                </form>
            </div>
            
            <ModalMensaje
                abierto={modalAbierto}
                mensaje={modalMensaje}
                onClose={() => {
                    setModalAbierto(false);
                    if (modalMensaje.includes("exitosamente")) {
                        // ✅ Recarga la lista después de actualizar
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

export default ActualizarRestaurante;
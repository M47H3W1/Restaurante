import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./ActualizarRestaurante.css";
import axios from "axios";

function ActualizarRestaurante(props) {
    const { actualizarRestaurante } = props;
    const { id } = useParams();
    const navigate = useNavigate();

    // Solo se ejecuta cuando cambia el id
    useEffect(() => {
        cargarRestaurante();
    }, [id]);

    const cargarRestaurante = () => {
        console.log("Cargando restaurante con id:", id);
        axios.get("http://localhost:3002/restaurantes/" + id)
            .then(response => {
                const restaurante = response.data;
                props.setState({
                    nombre: restaurante.nombre,
                    direccion: restaurante.direccion,
                    tipo: restaurante.tipo.charAt(0).toUpperCase() + restaurante.tipo.slice(1).toLowerCase(),
                    reputacion: restaurante.reputacion,
                    UrlImagen: restaurante.UrlImagen
                });
            })
            .catch(error => console.error('Error al obtener el restaurante:', error));
    };

    const handlerGuardar = () => {
        const restauranteActualizado = {
            id,
            nombre: props.state.nombre,
            direccion: props.state.direccion,
            tipo: props.state.tipo,
            reputacion: props.state.reputacion,
            UrlImagen: props.state.UrlImagen
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
                onChange={(e) => props.setState({ ...props.state, UrlImagen: e.target.value })}
                onFocus={e => e.target.select()}
            />
            
            {props.state.UrlImagen && (
                <div style={{ margin: "10px 0" }}>
                    <img
                        src={props.state.UrlImagen}
                        alt="Vista previa"
                        style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px", border: "1px solid #ccc" }}
                        onError={e => { e.target.src = "https://via.placeholder.com/200x150?text=Sin+Imagen"; }}
                    />
                </div>
            )}

            <button onClick={handlerGuardar}>Guardar</button>
        </div>
    );
}

export default ActualizarRestaurante;

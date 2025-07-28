import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/endpoints";
import "./TipoComida.css";
import ModalMensaje from "./ModalMensaje";

function ListaTipoComida() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [paisOrigen, setPaisOrigen] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPaisOrigen, setEditPaisOrigen] = useState("");
  const [mensaje, setMensaje] = useState(""); // Mensaje de error
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [confirmarAbierto, setConfirmarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Obtener todos los tipos al montar
  const obtenerTipos = () => {
    axios.get(ENDPOINTS.TIPO_COMIDA)
      .then(res => setTipos(res.data))
      .catch(() => setTipos([]));
  };

  useEffect(() => {
    obtenerTipos();
  }, []);

  // Crear nuevo tipo
  const handleCrear = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !paisOrigen.trim()) return;
    const existe = tipos.some(
      t => t.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );
    if (existe) {
      setMensaje("Ese tipo de restaurante ya existe.");
      return;
    }
    axios.post(ENDPOINTS.TIPO_COMIDA, { nombre, paisOrigen })
      .then(() => {
        setNombre("");
        setPaisOrigen("");
        setMensaje("");
        obtenerTipos();
        setModalMensaje("¡Tipo de restaurante creado exitosamente!");
        setModalAbierto(true);
      });
  };

  // Eliminar tipo
  const handleEliminar = (id) => {
    setIdAEliminar(id);
    setConfirmarAbierto(true);
  };

  const confirmarEliminacion = () => {
    if (idAEliminar === null) return;
    axios.delete(`${ENDPOINTS.TIPO_COMIDA}/${idAEliminar}`)
      .then(() => {
        setModalMensaje("Tipo de restaurante eliminado correctamente.");
        setModalAbierto(true);
        setConfirmarAbierto(false);
        // No llamar a obtenerTipos aquí, espera a que el usuario cierre el modal
      });
  };

  // Iniciar edición
  const handleEditar = (tipo) => {
    setEditId(tipo.id);
    setEditNombre(tipo.nombre);
    setEditPaisOrigen(tipo.paisOrigen || "");
    setMensaje("");
  };

  // Guardar edición
  const handleGuardar = (id) => {
    if (!editNombre.trim() || !editPaisOrigen.trim()) return;
    // Verifica si ya existe (case-insensitive), excluyendo el actual
    const existe = tipos.some(
      t => t.id !== id && t.nombre.trim().toLowerCase() === editNombre.trim().toLowerCase()
    );
    if (existe) {
      setMensaje("Ese tipo de restaurante ya existe.");
      return;
    }
    axios.put(`${ENDPOINTS.TIPO_COMIDA}/${id}`, { nombre: editNombre, paisOrigen: editPaisOrigen })
      .then(() => {
        setEditId(null);
        setEditNombre("");
        setEditPaisOrigen("");
        setMensaje("");
        obtenerTipos();
        setModalMensaje("Tipo de restaurante actualizado correctamente.");
        setModalAbierto(true);
      });
  };

  // Cancelar edición
  const handleCancelar = () => {
    setEditId(null);
    setEditNombre("");
    setEditPaisOrigen("");
    setMensaje("");
  };

  return (
    <div className="TipoComidaContainer">
      <h2>Tipos de Restaurante</h2>
      <form className="TipoComidaForm" onSubmit={handleCrear}>
        <input
          type="text"
          placeholder="Nuevo tipo de restaurante"
          value={nombre}
          onChange={e => {
            setNombre(e.target.value);
            setMensaje("");
          }}
        />
        <input
          type="text"
          placeholder="País de origen"
          value={paisOrigen}
          onChange={e => {
            setPaisOrigen(e.target.value);
            setMensaje("");
          }}
        />
        <button type="submit">Agregar</button>
      </form>
      {mensaje && (
        <div style={{
          color: "#ff4d4f",
          background: "#2e3240",
          borderRadius: "8px",
          padding: "10px 16px",
          marginBottom: "16px",
          fontWeight: "600",
          textAlign: "center"
        }}>
          {mensaje}
        </div>
      )}
      <ul className="TipoComidaLista">
        {tipos.map(tipo => (
          <li key={tipo.id} className="TipoComidaItem">
            {editId === tipo.id ? (
              <>
                <input
                  type="text"
                  value={editNombre}
                  onChange={e => {
                    setEditNombre(e.target.value);
                    setMensaje("");
                  }}
                  className="TipoComidaInputEdit"
                  placeholder="Tipo"
                />
                <input
                  type="text"
                  value={editPaisOrigen}
                  onChange={e => {
                    setEditPaisOrigen(e.target.value);
                    setMensaje("");
                  }}
                  className="TipoComidaInputEdit"
                  placeholder="País de origen"
                />
                <button className="guardar" onClick={() => handleGuardar(tipo.id)}>Guardar</button>
                <button className="cancelar" onClick={handleCancelar}>Cancelar</button>
              </>
            ) : (
              <>
                <span className="TipoComidaNombre">{tipo.nombre}</span>
                <span className="TipoComidaPais">({tipo.paisOrigen || "N/A"})</span>
                <button className="editar" onClick={() => handleEditar(tipo)}>Editar</button>
                <button className="eliminar" onClick={() => {
                  setIdAEliminar(tipo.id);
                  setConfirmarAbierto(true);
                }}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <ModalMensaje
        abierto={modalAbierto}
        mensaje={modalMensaje}
        onClose={() => {
          setModalAbierto(false);
          obtenerTipos(); // Ahora sí, actualiza la lista después de cerrar el modal
        }}
      />
      <ModalMensaje
        abierto={confirmarAbierto}
        mensaje="¿Eliminar este tipo de restaurante?"
        onClose={() => setConfirmarAbierto(false)}
        botones={
          <>
            <button
              className="ModalMensaje-boton"
              onClick={() => {
                setConfirmarAbierto(false);
                // Aquí sí llamas a la eliminación real:
                if (idAEliminar !== null) {
                  axios.delete(`${ENDPOINTS.TIPO_COMIDA}/${idAEliminar}`)
                    .then(() => {
                      setModalMensaje("Tipo de restaurante eliminado correctamente.");
                      setModalAbierto(true);
                      setIdAEliminar(null);
                    });
                }
              }}
            >
              Aceptar
            </button>
            <button
              className="ModalMensaje-boton"
              style={{ background: "#444" }}
              onClick={() => {
                setConfirmarAbierto(false);
                setIdAEliminar(null);
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

export default ListaTipoComida;

import Restaurante from './Restaurante';
import {useNavigate} from 'react-router-dom';
//import { Link } from 'react-router-dom';
import React, { useState } from 'react';
function ListaRestaurantes({
  restaurantes, 
  handleEliminar,
}) 
  {
    const [mensajeErrorLikesNegativos, setMensajeErrorLikesNegativos] = useState("");
    const [likesTotales, setLikesTotales] = useState(0);
    
    const SumarLikes = () => setLikesTotales((prev) => prev + 1);

    const RestarDislikes = () => {
      if (likesTotales <= 0) {
        mensajeErrorLikesNegativo("No se puede restar más likes");
        return;
      }
      setLikesTotales((prev) => prev - 1);
    };

    const mensajeErrorLikesNegativo = (mensaje) => {
      setMensajeErrorLikesNegativos(mensaje);
      setTimeout(() => setMensajeErrorLikesNegativos(""), 3000);
    };

  const navigate = useNavigate();

  const handleInicio = () => {
    navigate("/");  
  }
  const handleCrear = () => {
    navigate("/crear");
  }

  return (
    <div className="ListaRestaurantes">
      {/*<p>Se utiliza el hook useNavigate</p>*/}
      <button onClick={handleInicio}>Volver al incio</button>
      <br /><br />
      <button onClick={handleCrear}>Crear un nuevo Restaurante</button>
      <br /><br />
      {/*
      <p>Se utiliza Link</p>
      <Link to="/">
                <button>Volver al Inicio</button>
      </Link>
      */}
      <h1>Cantidad likes: {likesTotales}</h1>
      {mensajeErrorLikesNegativos && (
        <h2 style={{ color: "red" }}>{mensajeErrorLikesNegativos}</h2>
      )}
      {restaurantes.map((restaurante, index) => (
        <Restaurante
          key={index}
          index={index}
          id={restaurante.id}
          nombre={restaurante.nombre}
          direccion={restaurante.direccion}
          tipo={restaurante.tipo}
          reputacion={restaurante.reputacion}
          UrlImagen={restaurante.UrlImagen}
          SumarLikes={SumarLikes}
          RestarDislikes={RestarDislikes}
          mensajeErrorLikesNegativo={mensajeErrorLikesNegativo}
          handleEliminar={handleEliminar}
        />
      ))}
    </div>
  );
}

export default ListaRestaurantes;

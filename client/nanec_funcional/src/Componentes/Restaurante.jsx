import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Restaurante_.css";
function Restaurante (props){
    
    const {id, nombre, direccion, tipo, UrlImagen, SumarLikes,RestarDislikes, reputacion, index, handleEliminar}= props;
    const {tipos} = props;

    const [preferencias, setPreferencias] = useState({
        likes: 0,
        dislikes: 0,
    });
    //Podría ocurrir que esta linea no funcione, dado que 
    //react busca la optimización, y solo renderiza cuando
    //es necesario. Espera varias operaciones antes de renderizar
    //
    
    const handlerLike = () =>{
        //setLikes(likes + 1); //Forma correcta de modificar el estado
        setPreferencias(prevPreferencias => {
            
                //Se crea una copia del estado actual   
            return{...prevPreferencias, likes: prevPreferencias.likes + 1}
        });
        SumarLikes();
    }
    

    const estrellas = () => {
    let resultado = '';
    for (let i = 0; i < reputacion; i++) {
      resultado += '⭐';
    }
    return resultado;
    };

        /*
        setLikes(prevLikes =>{
            return (prevLikes + 1) //Forma correcta de modificar el estado, usando el valor previo
            }
        );
        */
    
    
    const handlerDislike = () => {
        setPreferencias(prevPreferencias => {
            //setDislikes(prevDislikes => prevDislikes - 1);
            return {...prevPreferencias, dislikes: prevPreferencias.dislikes - 1}
            
        });
        RestarDislikes();
    }

    const handlerEliminar_ = () => {
        handleEliminar(index);
    }
    const navigate = useNavigate();

    const handleActualizar = () => {
        navigate("/actualizar/" + id );
    }

    return (
        <div className="Restaurante">
            <img src={UrlImagen} alt="" />
            <h1>{nombre}</h1>
            <h3>{direccion}</h3>
            <h4>{tipo}</h4>
            <h4>Reputación: {estrellas()}</h4>
            <h4>Me gusta:{preferencias.likes}</h4>
            <h4>No me gusta:{preferencias.dislikes}</h4>
            <div>
                <strong>Tipos:</strong>{" "}
                {tipos && tipos.length > 0 ? (
                <span>
                    {tipos.map((tipo, idx) => (
                    <span
                        key={idx}
                        style={{
                        background: "#ffe082",
                        color: "#6d4c00",
                        borderRadius: "12px",
                        padding: "2px 10px",
                        fontSize: "0.95em",
                        border: "1px solid #e0b800",
                        marginRight: "5px"
                        }}
                    >
                        {tipo}
                    </span>
                    ))}
                </span>
                ) : (
                <span style={{ color: "#888" }}>Sin tipo</span>
                )}
            </div>
            <button onClick={handlerLike}>👍</button>
            <button onClick={handlerDislike}>👎</button>
            <div className="botones-acciones">
                <button onClick={handlerEliminar_}>Eliminar</button>
                <button onClick={handleActualizar}>Actualizar</button>
            </div>
        </div>  
    );      
    
}

export default Restaurante;
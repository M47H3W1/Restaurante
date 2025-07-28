import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Restaurante_.css";
function Restaurante (props){
    
    const {id, nombre, direccion, UrlImagen, SumarLikes,RestarDislikes, reputacion, index, handleEliminar}= props;
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
            <img src={UrlImagen} alt={nombre} />
            <div className="Restaurante-content">
                <h1>{nombre}</h1>
                <h3>{direccion}</h3>
                <div className="tipos">
                {tipos && tipos.length > 0
                    ? tipos.map((tipo, idx) => (
                        <span className="tipo-badge" key={idx}>{tipo}</span>
                    ))
                    : <span className="tipo-badge" style={{background: "#eee", color: "#aaa"}}>Sin tipo</span>
                }
                </div>
                <h4>Reputación: {estrellas()}</h4>
                <div className="actions">
                <button onClick={handlerLike} title="Me gusta">👍</button>
                <button onClick={handlerDislike} title="No me gusta">👎</button>
                <span style={{marginLeft: 12, color: "var(--color-muted)"}}>Likes: {preferencias.likes} | Dislikes: {preferencias.dislikes}</span>
                </div>
            </div>
            <div className="botones-acciones">
                <button onClick={handlerEliminar_}>Eliminar</button>
                <button onClick={handleActualizar}>Actualizar</button>
            </div>
        </div>  
    );      
    
}

export default Restaurante;
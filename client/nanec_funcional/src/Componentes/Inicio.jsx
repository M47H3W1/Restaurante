import {useNavigate} from 'react-router-dom';
import "./Inicio.css";
//import { Link } from 'react-router-dom';
function Inicio() {
    const navigate = useNavigate();
    const handleLista=()=> {
        navigate("/lista");
    }
    const handleCrear=()=> {
        navigate("/crear");
    }
  return (
    <div className="Inicio">
    <h1>
        Bienvenido a la Aplicación de Restaurantes
    </h1>
    {/*<p>Se utiliza el hook useNavigate</p>*/}
    <button onClick={handleLista}>Ver lista de restaurantes</button>
    <br />
    <br />
    <button onClick={handleCrear}>Crear nuevo restaurante</button>
    <br />
    <button onClick={() => navigate("/tipos")}>Gestionar Tipos de Restaurante</button>
    <br />

    </div>
  );
}

export default Inicio;
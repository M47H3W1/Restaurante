// llamar al endpoint de restaurantes
//http://localhost:3001/restaurantes
//boton llamado obtenerRestaurantes que trae los restaurantes
import React, { useState } from 'react';
import axios from 'axios';

const ComponenteAxios = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    
    const [clientes, setClientes] = useState([]);

    const obtenerRestaurantesClientes = () => {
        axios.get('http://localhost:3000/restaurantes').then(response => {
            setRestaurantes(response.data);
            console.log(response);
        });
        axios.get('http://localhost:3000/clientes').then(response => {
            setClientes(response.data);
            console.log(response);
        });
    };
    
    return (
        <div>
            <button onClick={obtenerRestaurantesClientes}>
                Obtener Restaurantes
            </button>
            
            <div>
                <ul>
                    {restaurantes.map((restaurante) => (
                        <li key={restaurante.id}>{restaurante.nombre}</li>
                    ))}
                </ul>
            </div>
            <div>
                <ul>
                    {clientes.map((cliente) => (
                        <li key={cliente.id}>{cliente.nombre}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ComponenteAxios;
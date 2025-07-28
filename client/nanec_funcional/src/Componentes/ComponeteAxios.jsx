// llamar al endpoint de restaurantes
//http://localhost:3001/restaurantes
//boton llamado obtenerRestaurantes que trae los restaurantes
import React, { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../config/endpoints';

const ComponenteAxios = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [clientes, setClientes] = useState([]);

    const obtenerRestaurantesClientes = () => {
        axios.get(ENDPOINTS.RESTAURANTES).then(response => {
            setRestaurantes(response.data);
            console.log(response);
        }).catch(error => console.error('Error al obtener restaurantes:', error));
        
        axios.get(ENDPOINTS.USERS).then(response => {
            setClientes(response.data);
            console.log(response);
        }).catch(error => console.error('Error al obtener usuarios:', error));
    };
    
    return (
        <div>
            <button onClick={obtenerRestaurantesClientes}>
                Obtener Restaurantes y Usuarios
            </button>
            
            <div>
                <h3>Restaurantes:</h3>
                <ul>
                    {restaurantes.map((restaurante) => (
                        <li key={restaurante.id}>{restaurante.nombre}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Usuarios:</h3>
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
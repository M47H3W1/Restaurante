const BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
  RESTAURANTES: `${BASE_URL}/restaurantes`,
  MENU: `${BASE_URL}/menu`,
  TIPO_COMIDA: `${BASE_URL}/tipo`,
  USERS: `${BASE_URL}/usuarios`,
  LOGIN: `${BASE_URL}/usuarios/login`,
  REGISTER: `${BASE_URL}/usuarios/register`
  
};

export default ENDPOINTS;
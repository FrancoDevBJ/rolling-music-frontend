import React from 'react';
// Importa el componente de formulario con la lógica de autenticación
import LoginForm from '../components/LoginForm'; 

const Login = () => {
    /* El LoginForm ya contiene el diseño (Tailwind) y la lógica de estado (Zod, useAuth),
      por lo que la página solo necesita renderizarlo.
    */
    return (
        <LoginForm /> 
    );
};

export default Login;
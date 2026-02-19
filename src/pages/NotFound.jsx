import React from 'react'
import "../assets/styles/NotFound.css";
import Swal from 'sweetalert2';

function NotFound() {
  const handleClick = () => {
    Swal.fire({
      title: "Quiere volver a Inicio?",
      text: "La página que buscas no existe.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, volver al inicio",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/";
      }
    });
  };

  return (
    
    <div className="notfound-container">
     
      <header>
        <h1 className='h1Error'>Error 404</h1>
      </header>

      <main className='mainError'>
        <img
          src="https://i.gifer.com/7VE.gif"
          alt="gif de la imagen de error"
          className='img-error'
        />

        <h2 className='paginaErrorTitulo'>Se nos cayó la página… pero no las ganas de programar.</h2>

        <p className='textoPaginaError'>
          La página que estás buscando no existe o fue movida. <br />
          Por favor, revisá la dirección o volvé al inicio.
        </p>

        <button className='bototnError' onClick={handleClick}>🔙 Volver al Inicio</button>


        
      </main>
    </div>
  );
}

export default NotFound;
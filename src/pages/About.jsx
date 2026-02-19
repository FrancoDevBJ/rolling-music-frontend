/* ESTAS IMPORTACIONES ME SIRVEN PARA TRAER IMAGENES Y COMPONENTES NECESARIOS PARA LA PÁGINA */
import fondo from '../assets/imagenes/logos/fondo-nosotros.png'
import marcos from '../assets/imagenes/Img-miembros/marcos.png';
import juan from '../assets/imagenes/Img-miembros/Juan.png';
import moms from '../assets/imagenes/Img-miembros/Moms.png';
import lucas from '../assets/imagenes/Img-miembros/Lucas.png';
import franco from '../assets/imagenes/Img-miembros/franco.png';
import luis from '../assets/imagenes/Img-miembros/luis.png';
import EfectoLluvia from '../components/EfectoLluvia';
import logo from '../assets/imagenes/logos/Logo.png';
import vinilo from '../assets/imagenes/logos/vinilo.png';
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


function About() {

  const [miembroSeleccionado, setMiembroSeleccionado] = React.useState({
    id: 0,
    nombre: 'Rolling Play',
    img: logo,
    description: 'Somos un grupo de desarrolladores comprometido con la creacion de experiencias digitales innovadoras y de alta calidad.',
  });

  const miembros = [
    {id: 1,
    nombre: 'Marcos Valladares',
    img: marcos,
    description: 'Scrum Master y Desarrollador FrontEnd, Con muchas ganas de aprender y crecer en el mundo del desarrollo web.',
    linkedin: 'https://www.linkedin.com/in/marcos-adrian-valladares-65a043286/',
    github:'https://github.com/marcosvalla28'
    },
    {
      id: 2,
      nombre: 'Juan Garcia',
      img: juan,
      description:'Desarrollador Full Stack apasionado por crear experiencias web completas. Siempre en busca de nuevos desafíos y tecnologías que me permitan crecer como profesional.',
      linkedin: 'https://www.linkedin.com/in/juangarcia14/',
      github:'https://github.com/Juanmd14'
    },
    {
      id: 3,
      nombre: 'Franco Quinteros',
      img: franco,
      description: 'Soy un amante de la tecnología y el desarrollo web. Me gusta todo el tiempo aprender cosas nuevas.',
      linkedin: 'https://www.linkedin.com/in/franco-quinteros-dev/',
      github:'https://github.com/FrancoDevBJ'
    },
    {
      id: 4,
      nombre: 'Eliana Ocampo',
      img: moms,
      description: 'Somos nuestra memoria, somos ese quimérico museo de formas inconstantes, ese montón de espejos rotos.',
      linkedin: 'https://www.linkedin.com/in/romina-ocampo-42024b28b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      github:'https://github.com/MomsDeLaSelva'
    },
    {
      id: 5,
      nombre: 'Luis Santiago Sandoval',
      img: luis,
      description: '',
      linkedin: 'https://www.linkedin.com/in/luis-sandoval-47233b375/',
      github:'https://github.com/LUISS005'
    },
    {
      id: 6,
      nombre: 'Lucas Teseira',
      img: lucas,
      description: 'Estoy aprendiendo desarrollo de software y me apasiona descubrir cómo transformar ideas en código. Cada día busco mejorar y aprender algo nuevo.',
      linkedin: 'https://www.linkedin.com/in/lucas-benjamin-teseira-023338319/',
      github:'https://github.com/teseira-lucas'
    }
  ]



  return (
    <>

    <div id="app2">
      <header className="[grid-area:navbar] flex-col flex h-24"> 
            <Navbar/>
    </header>


    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat relative flex flex-col justify-between items-center pt-20 px-4 md:px-10"
    style={{ backgroundImage: `url(${fondo})` }}>

      <EfectoLluvia/>

      
      <div className="animate-fade-in border-2 border-violet-400 rounded-xl m-8 p-6 min-h-[400px] bg-violet-300/70 flex flex-col md:flex-row items-center justify-center gap-10 z-10 w-full max-w-6xl">

      <div className='w-48 h-48 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] justify-items-center content-center shrink-0 z-10 overflow-hidden rounded-full bg-cover bg-center bg-no-repeat shadow-2xl'
      style={{ backgroundImage: miembroSeleccionado.id !== 0 ? `url(${vinilo})` : "none"}}
      >
        <img 
        src={miembroSeleccionado.img} 
        alt={miembroSeleccionado.nombre}
        className={`object-cover rounded-full drop-shadow-2xl w-48 sm:w-64 lg:w-[400px]
        ${miembroSeleccionado.id === 1 ? 'object-cover' : ''}`}
        
        />
      </div>
      <div>
      
      <h2 className='text-2xl sm:text-4xl lg:text-5xl mb-8 font-mono text-center drop-shadow-black-9xl shrink-0 z-10'>{miembroSeleccionado.nombre}</h2>
      
      <p className=" text-gray-700 text-center max-w-lg text-base sm:text-lg lg:text-xl mt-8">{miembroSeleccionado.description}</p>

      <div className='justify-self-center'>
      {miembroSeleccionado.id !== 0 &&(
        <button 
        onClick={() => window.open(miembroSeleccionado.linkedin, '_blank', 'noopener,noreferrer')}
        className='flex justify-center flex-wrap gap-5 px-2 py-2 mt-7 bg-violet-700 cursor-pointer hover:cursor-pointer text-white font-semibold rounded-lg shadow-md  hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-300 z-999'
        ><FontAwesomeIcon icon={faLinkedin} size='2x'/></button>
      )}
      {miembroSeleccionado.id !== 0 &&(
        <button 
        onClick={() => window.open(miembroSeleccionado.github, '_blank', 'noopener,noreferrer')}
        className='px-2 py-2 mt-7 mx-7 cursor-pointer hover:cursor-pointer bg-violet-700 text-white font-semibold rounded-lg shadow-md  hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 z-999'><FontAwesomeIcon icon={faGithub} size='2x'/></button>
      )}
      </div>

      </div>
      </div>

      <div className='animate-fade-in grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex mt-10 mb-10 relative gap-4 justify-center'
      >
        {miembros.map((m, index) =>(
          <img
        key={m.id}
        src={m.img} 
        alt={m.nombre}
        onClick={() => setMiembroSeleccionado(m)}
        className={`brightness-50 hover:brightness-90
        w-full h-56 sm:h-60 object-contain cursor-pointer
        mask-[linear-gradient(to_bottom,black_60%,transparent)]
        hover:mask-[linear-gradient(to_bottom,black_90%,transparent)]
        opacity-90 hover:scale-110 transition-transform duration-300
        hover:opacity-100 hover:z-50 relative
        ${index !== 0 ? '-ml-10' : ''}`}
        />
        ))}
      </div>
    </div>

    </div>

    
    <Footer/>
    </>
  )
}

export default About

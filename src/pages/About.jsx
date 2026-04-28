import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Footer from '../components/Footer';
import EfectoLluvia from '../components/EfectoLluvia';

import marcos from '../assets/imagenes/Img-miembros/marcos.png';
import juan from '../assets/imagenes/Img-miembros/Juan.png';
import moms from '../assets/imagenes/Img-miembros/Moms.png';
import lucas from '../assets/imagenes/Img-miembros/Lucas.png';
import franco from '../assets/imagenes/Img-miembros/franco.png';
import luis from '../assets/imagenes/Img-miembros/luis.png';
import logo from '../assets/imagenes/logos/Logo.png';

const miembros = [
    {
        id: 1,
        nombre: 'Marcos Valladares',
        rol: 'Scrum Master · Frontend',
        img: marcos,
        description: 'Con muchas ganas de aprender y crecer en el mundo del desarrollo web.',
        linkedin: 'https://www.linkedin.com/in/marcos-adrian-valladares-65a043286/',
        github: 'https://github.com/marcosvalla28'
    },
    {
        id: 2,
        nombre: 'Juan Garcia',
        rol: 'Full Stack Developer',
        img: juan,
        description: 'Apasionado por crear experiencias web completas. Siempre en busca de nuevos desafíos y tecnologías.',
        linkedin: 'https://www.linkedin.com/in/juangarcia14/',
        github: 'https://github.com/Juanmd14'
    },
    {
        id: 3,
        nombre: 'Franco Quinteros',
        rol: 'Full Stack Developer',
        img: franco,
        description: 'Amante de la tecnología y el desarrollo web. Me gusta aprender cosas nuevas constantemente.',
        linkedin: 'https://www.linkedin.com/in/franco-quinteros-dev/',
        github: 'https://github.com/FrancoDevBJ'
    },
    {
        id: 4,
        nombre: 'Eliana Ocampo',
        rol: 'Frontend Developer',
        img: moms,
        description: 'Somos nuestra memoria, ese quimérico museo de formas inconstantes, ese montón de espejos rotos.',
        linkedin: 'https://www.linkedin.com/in/romina-ocampo-42024b28b',
        github: 'https://github.com/MomsDeLaSelva'
    },
    {
        id: 5,
        nombre: 'Luis Sandoval',
        rol: 'Frontend Developer',
        img: luis,
        description: 'Desarrollador frontend con pasión por crear interfaces atractivas y funcionales.',
        linkedin: 'https://www.linkedin.com/in/luis-sandoval-47233b375/',
        github: 'https://github.com/LUISS005'
    },
    {
        id: 6,
        nombre: 'Lucas Teseira',
        rol: 'Frontend Developer',
        img: lucas,
        description: 'Aprendiendo desarrollo de software, apasionado por transformar ideas en código.',
        linkedin: 'https://www.linkedin.com/in/lucas-benjamin-teseira-023338319/',
        github: 'https://github.com/teseira-lucas'
    }
];

function About() {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes vinylSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .fade-up { animation: fadeSlideUp 0.6s ease both; }
                .fade-in { animation: fadeIn 0.4s ease both; }
                .member-card:hover .member-overlay { opacity: 1; }
                .member-card:hover img { transform: scale(1.08); }
            `}</style>

            <div
                className="min-h-screen flex flex-col relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #060010 0%, #0a0a0a 40%, #030008 100%)' }}
            >
                <EfectoLluvia />

                {/* Decoración de fondo */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
                        filter: 'blur(40px)'
                    }}
                />

                <main className="flex-1 relative z-10 px-4 sm:px-8 md:px-12 py-12 md:py-16">
                    <div className="max-w-7xl mx-auto">

                        {/* ── Header ── */}
                        <div className="fade-up mb-16 md:mb-20">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-violet-500 font-black mb-3">
                                Quiénes somos
                            </p>
                            <h1
                                className="font-black leading-none mb-6"
                                style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.03em' }}
                            >
                                El equipo detrás de<br />
                                <span style={{ color: '#a78bfa' }}>Rolling Play</span>
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed">
                                Somos un grupo de desarrolladores comprometidos con la creación
                                de experiencias digitales innovadoras y de alta calidad.
                            </p>
                        </div>

                        {/* ── Layout principal ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                            {/* ── Grid de miembros ── */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {miembros.map((m, i) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelected(selected?.id === m.id ? null : m)}
                                        className="member-card relative rounded-2xl overflow-hidden cursor-pointer text-left group"
                                        style={{
                                            animationDelay: `${i * 80}ms`,
                                            animation: 'fadeSlideUp 0.5s ease both',
                                            aspectRatio: '3/4',
                                            border: selected?.id === m.id
                                                ? '2px solid rgba(167,139,250,0.8)'
                                                : '2px solid rgba(255,255,255,0.05)',
                                            boxShadow: selected?.id === m.id
                                                ? '0 0 24px rgba(167,139,250,0.2)'
                                                : 'none',
                                            transition: 'border-color 0.3s, box-shadow 0.3s'
                                        }}
                                    >
                                        {/* Imagen */}
                                        <img
                                            src={m.img}
                                            alt={m.nombre}
                                            className="w-full h-full object-cover object-top"
                                            style={{ transition: 'transform 0.5s ease' }}
                                            onError={(e) => { e.target.src = logo; }}
                                        />

                                        {/* Overlay gradiente siempre visible abajo */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                                            }}
                                        />

                                        {/* Overlay hover */}
                                        <div
                                            className="member-overlay absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                                            style={{
                                                opacity: 0,
                                                background: 'rgba(124,58,237,0.25)',
                                                backdropFilter: 'blur(2px)'
                                            }}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ background: 'rgba(167,139,250,0.9)' }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Nombre siempre visible abajo */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <p className="text-white font-black text-xs sm:text-sm leading-tight truncate">
                                                {m.nombre.split(' ')[0]}
                                            </p>
                                            <p className="text-violet-300 text-[9px] sm:text-[10px] uppercase tracking-wider truncate">
                                                {m.rol.split('·')[0].trim()}
                                            </p>
                                        </div>

                                        {/* Indicador seleccionado */}
                                        {selected?.id === m.id && (
                                            <div
                                                className="absolute top-3 right-3 w-3 h-3 rounded-full"
                                                style={{ background: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.8)' }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* ── Panel de detalle ── */}
                            <div className="lg:sticky lg:top-8">
                                {selected ? (
                                    <div
                                        key={selected.id}
                                        className="fade-in rounded-3xl overflow-hidden"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)'
                                        }}
                                    >
                                        {/* Foto grande */}
                                        <div className="relative h-64 sm:h-80 overflow-hidden">
                                            <img
                                                src={selected.img}
                                                alt={selected.nombre}
                                                className="w-full h-full object-cover object-[center_1%]"
                                                onError={(e) => { e.target.src = logo; }}
                                            />
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: 'linear-gradient(to top, #0a0a0a 0%, transparent 60%)' }}
                                            />
                                            {/* Rol badge */}
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                                    style={{ background: 'rgba(124,58,237,0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                                                >
                                                    {selected.rol}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 sm:p-8">
                                            <h2
                                                className="font-black text-white leading-tight mb-1"
                                                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}
                                            >
                                                {selected.nombre}
                                            </h2>

                                            {selected.description && (
                                                <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-6">
                                                    {selected.description}
                                                </p>
                                            )}

                                            {/* Links */}
                                            <div className="flex gap-3">
                                                <a
                                                    href={selected.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                                                    style={{ background: '#0a66c2', color: '#fff' }}
                                                >
                                                    <FontAwesomeIcon icon={faLinkedin} />
                                                    LinkedIn
                                                </a>
                                                <a
                                                    href={selected.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                                                    style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                                                >
                                                    <FontAwesomeIcon icon={faGithub} />
                                                    GitHub
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Estado vacío — invita a seleccionar
                                    <div
                                        className="fade-in rounded-3xl flex flex-col items-center justify-center text-center p-12"
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px dashed rgba(255,255,255,0.08)',
                                            minHeight: '300px'
                                        }}
                                    >
                                        <img src={logo} alt="Rolling Play" className="w-20 opacity-30 mb-4" />
                                        <p className="text-gray-600 text-sm">
                                            Seleccioná un miembro<br />para conocer más
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}

export default About;

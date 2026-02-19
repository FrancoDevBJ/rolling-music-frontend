import logo from '../assets/imagenes/logos/Logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faShield, faFileContract, faHeadset, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

function Footer() {
  const [openModal, setOpenModal] = useState(false);
  const [terminosModal, setTerminosModal] = useState(false);
  const [openSoporte, setOpenSoporte] = useState(false);

  const socialLinks = [
    {
      href: "https://www.linkedin.com/school/rollingcodeschool/posts/?feedView=all",
      icon: faLinkedin,
      label: "LinkedIn",
      hoverColor: "hover:text-blue-400",
    },
    {
      href: "https://web.rollingcodeschool.com/",
      icon: faGithub,
      label: "GitHub",
      hoverColor: "hover:text-gray-200",
    },
    {
      href: "https://www.facebook.com/RollingCodeSchool?locale=es_LA",
      icon: faFacebook,
      label: "Facebook",
      hoverColor: "hover:text-blue-500",
    },
    {
      href: "https://www.instagram.com/rollingcodeschool/",
      icon: faInstagram,
      label: "Instagram",
      hoverColor: "hover:text-fuchsia-400",
    },
  ];

  const legalButtons = [
    { label: "Políticas de Privacidad", icon: faShield, action: () => setOpenModal(true) },
    { label: "Términos y Condiciones", icon: faFileContract, action: () => setTerminosModal(true) },
    { label: "Soporte", icon: faHeadset, action: () => setOpenSoporte(true) },
  ];

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-linear-to-b from-purple-950 to-neutral-900 border border-purple-500/30 text-white rounded-2xl p-6 max-w-lg w-full relative shadow-2xl shadow-purple-900/40 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-purple-800/40 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="text-xl font-bold mb-5 text-center text-violet-300 pr-6">{title}</h2>
          <div className="text-sm leading-relaxed text-gray-300 space-y-3 max-h-80 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#7c3aed_transparent]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="w-full z-10 border-t border-purple-500/20">

      {/* Cuerpo principal del footer */}
      <div className="bg-linear-to-r from-[#0d001a] via-[#1a0033] to-[#0d001a] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <div className="shrink-0">
            <img
              src={logo}
              alt="RollingMusic logo"
              className="h-20 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl uppercase tracking-widest text-purple-400 font-semibold">Seguinos</p>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-purple-300 ${hoverColor} hover:scale-125 transition-all duration-200 drop-shadow-sm`}
                >
                  <FontAwesomeIcon icon={icon} size="2xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Avisos legales */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <p className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1">Legales</p>
            {legalButtons.map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-violet-300 transition-colors duration-200 group"
              >
                <FontAwesomeIcon
                  icon={icon}
                  className="text-purple-600 group-hover:text-violet-400 transition-colors text-xs"
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferior de copyright */}
      <div className="bg-linear-to-r from-purple-950/80 via-black to-purple-950/80 py-3 px-4 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} RollingMusic · Hecho con{" "}
          <span className="text-fuchsia-500">♪</span> para{" "}
          <a
            href="https://rollingcode.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-violet-300 transition-colors font-medium"
          >
            RollingCode
          </a>
        </p>
      </div>

      {/* ——— MODALES ——— */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Políticas de Privacidad">
        <p>
          En <strong className="text-violet-300">RollingMusic</strong> nos comprometemos a proteger tu privacidad.
          La información que recopilamos se utiliza únicamente para mejorar tu experiencia en nuestra plataforma.
          No compartimos tus datos personales con terceros sin tu consentimiento explícito.
        </p>
        <p>
          Al utilizar nuestro sitio, aceptás nuestras políticas de privacidad y el tratamiento de la información
          según las leyes vigentes de protección de datos.
        </p>
        <p>
          Podés solicitarnos en cualquier momento la eliminación de tus datos personales escribiéndonos a{" "}
          <span className="text-violet-300">soporterollingplay@gmail.com</span>.
        </p>
      </Modal>

      <Modal isOpen={terminosModal} onClose={() => setTerminosModal(false)} title="Términos y Condiciones">
        <p>Bienvenido/a a RollingMusic. Al acceder o utilizar este sitio, aceptás cumplir con los siguientes términos.</p>
        <p><strong className="text-violet-300">1. Uso del sitio</strong><br />El contenido es únicamente para uso personal y no comercial. No está permitido copiar, distribuir o reutilizar ningún contenido sin autorización previa.</p>
        <p><strong className="text-violet-300">2. Propiedad intelectual</strong><br />Todos los derechos sobre textos, imágenes, logotipos, íconos, diseños y código fuente pertenecen a RollingCode o a sus respectivos autores.</p>
        <p><strong className="text-violet-300">3. Privacidad</strong><br />Nos comprometemos a proteger tu información personal. Consultá nuestra Política de Privacidad para más detalles.</p>
        <p><strong className="text-violet-300">4. Responsabilidad</strong><br />No nos hacemos responsables por daños derivados del uso del sitio. El acceso corre por tu cuenta y riesgo.</p>
        <p><strong className="text-violet-300">5. Modificaciones</strong><br />Nos reservamos el derecho de actualizar estos términos en cualquier momento sin previo aviso.</p>
      </Modal>

      <Modal isOpen={openSoporte} onClose={() => setOpenSoporte(false)} title="Centro de Soporte">
        <p>¿Tenés algún problema o duda? Estamos acá para ayudarte.</p>
        <div className="bg-purple-900/30 rounded-xl p-3 border border-purple-700/30 space-y-1">
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-violet-400" />
            <span className="text-violet-300">soporterollingplay@gmail.com</span>
          </p>
          <p className="text-gray-400 text-xs pl-5">Lunes a Viernes · 9:00 a 18:00 (GMT-3)</p>
          <p className="text-gray-400 text-xs pl-5">Tiempo de respuesta: 24 a 48 hs hábiles</p>
        </div>
        <p>
          Antes de contactarnos, revisá la sección de <strong className="text-violet-300">Preguntas Frecuentes</strong> donde
          respondemos las dudas más comunes sobre uso de la plataforma, registro y recuperación de cuenta.
        </p>
        <p className="text-gray-400 text-xs">
          Si ya nos escribiste, por favor no envíes múltiples mensajes sobre el mismo tema: esto nos ayuda a responderte más rápido.
        </p>
      </Modal>
    </footer>
  );
}

export default Footer;
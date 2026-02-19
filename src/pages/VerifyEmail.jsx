import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/imagenes/logos/Logo.png';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // El email se pasa desde RegisterForm
    const email = location.state?.email || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');


    //funciones para los 6 digitos


    // mueve el foco al siguiente input para que no tengas que clickear cada casilla
    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };


    // detecta cuando apretas borrar en una casilla vaciaa y se mueve a la casilla anterior
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };


    //si copias el codigo del email y lo pegas
    //agarra el texto, filtra solo los numero y los distribuye automaticamente.
    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            document.getElementById('code-5')?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            setErrorMsg('Ingresá los 6 dígitos del código.');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                // Mensajes dependiendo la respuesta del backend
                if (data.message?.includes('expiró') || data.message?.includes('expiro')) {
                    setErrorMsg('El código expiró. Registrate nuevamente para recibir uno nuevo.');
                } else if (data.message?.includes('incorrecto')) {
                    setErrorMsg('Código incorrecto. Revisá el email y volvé a intentarlo.');
                } else if (data.message?.includes('ya esta verificado')) {
                    setErrorMsg('Este email ya fue verificado. Podés iniciar sesión.');
                } else {
                    setErrorMsg(data.message || 'Ocurrió un error. Intentá de nuevo.');
                }
                setCode(['', '', '', '', '', '']);
                document.getElementById('code-0')?.focus();
                return;
            }

            setStatus('success');
        } catch {
            setStatus('error');
            setErrorMsg('Error de conexión. Intentá de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-purple-500/20 p-8 flex flex-col items-center gap-6 text-center">

                <img
                    src={logo}
                    alt="RollingMusic"
                    className="h-26 object-contain]"
                />

                {status !== 'success' ? (
                    <>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verificá tu email</h2>
                            <p className="text-gray-400 text-sm">
                                Te enviamos un código de 6 dígitos a{' '}
                                <span className="text-violet-400">{email || 'tu email'}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
                            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`code-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, i)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl
                               bg-neutral-800 border-2 text-white
                               border-neutral-600 focus:border-violet-500 focus:outline-none
                               transition-colors duration-200"
                                    />
                                ))}
                            </div>

                            {errorMsg && (
                                <p className="text-red-400 text-sm">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-900 disabled:opacity-40
                           text-white font-semibold rounded-xl transition duration-200"
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verificando...
                                    </span>
                                ) : 'Verificar codigo'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-gray-400 hover:text-white font-semibold rounded-xl transition duration-200"
                            >
                                Volver al login
                            </button>
                        </form>

                        <p className="text-gray-500 text-xs">
                            No recibiste el codigo? Revisa tu carpeta de spam.
                        </p>
                    </>
                ) : (
                    <>
                    
                        <div className="w-16 h-16 rounded-full bg-violet-600/20 border-2 border-violet-500 flex items-center justify-center">
                       
                            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">¡Email verificado!</h2>
                            <p className="text-gray-400 text-sm">Tu cuenta está activa. Ya podés ingresar.</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition duration-200"
                        >
                            Ir al login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
import {signInWithPopup, signOut as firebaseSignOut} from 'firebase/auth';
import {auth, googleProvider} from '../config/firebase';

// ----------------------------------------------------
// 1. Definir el Admin
// ¡CAMBIA ESTE EMAIL por el correo de Google que usarás para loguearte como administrador!
const ADMIN_EMAIL = 'fquinteros701@gmail.com'; 
// ----------------------------------------------------

class GoogleAuthService {

    // Método para login con Google
    async loginWithGoogle(){
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // ----------------------------------------------------
            // 2. Incluir la Lógica del Rol
            const userRole = user.email === ADMIN_EMAIL ? 'admin' : 'user';
            // ----------------------------------------------------

            // Crear un objeto de usuario compatible con nuestra app
            const userData = {
                id: user.uid, // Usar uid de Firebase para el ID único
                email: user.email,
                username: user.displayName || user.email.split('@')[0],
                name: user.displayName,
                photoURL: user.photoURL,
                provider: 'google',
                // ----------------------------------------------------
                role: userRole, // Incluir el rol aquí
                // ----------------------------------------------------
            };

            // Guardar solo el usuario logueado (incluyendo el rol)
            localStorage.setItem('user', JSON.stringify(userData));

            // Nota: Se elimina la lógica de guardar 'users' en localStorage
            // porque no es necesaria y duplica datos.
            
            return userData;
            
        } catch (error) {
            throw new Error(this.getErrorMessage(error.code))
        }
    }

    //metodo para logout de google
    async logout(){
        try {
            if(auth.currentUser){
                await firebaseSignOut(auth);
            }
            
        } catch (error) {
            console.error('error al cerrar sesion de Google: ', Error);
        }
    }

    //metodo para manejar los erroes de google
    getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Login cancelado por el usuario';
      case 'auth/popup-blocked':
        return 'Popup bloqueado. Permite popups para este sitio';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return 'Error al iniciar sesión con Google';
    }
  }
}


const googleAuthService = new GoogleAuthService();
export default googleAuthService;
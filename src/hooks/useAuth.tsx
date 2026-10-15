// Hook para manejar el estado de autenticación.
// El estado vive en AuthContext (una sola sesión/perfil para toda la app);
// este hook es la fachada estable que consume la UI.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export type { UserProfile } from '../contexts/AuthContext';

/** Fachada: devuelve el estado global de auth desde el contexto. */
export function useAuth() {
  return useAuthContext();
}

/**
 * Componente guarda: se usa como ruta padre sin path en el árbol de rutas.
 * Redirige a /auth si no hay sesión y renderiza <Outlet/> si la hay.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-[14px] text-[#757575]">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

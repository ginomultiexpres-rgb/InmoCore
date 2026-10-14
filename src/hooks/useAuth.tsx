// Hook para manejar el estado de autenticación
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, getProfile } from "../lib/supabase-client.ts";

interface UserProfile {
  id: string
  full_name: string
  role: string
  email: string
}

interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user && mounted) {
          const profileResult = await getProfile()
          if (!profileResult || profileResult.error) throw profileResult?.error ?? new Error('Error al obtener perfil')
          const profile = profileResult.data as UserProfile | null
          setAuthState({
            user: profile ? {
              id: user.id,
              full_name: profile?.full_name,
              role: profile?.role,
              email: user.email || '',
            } : null,
            loading: false,
            error: null,
          })
        } else if (mounted) {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          })
        }
      } catch (err: any) {
        if (mounted) {
          setAuthState({
            user: null,
            loading: false,
            error: err.message,
          })
        }
      }
    }

    checkAuth()

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session && mounted) {
          const profileResult = await getProfile()
          if (!profileResult || profileResult.error) throw profileResult?.error ?? new Error('Error al obtener perfil')
          const profile = profileResult.data as UserProfile | null
          setAuthState({
            user: profile ? {
              id: session.user.id,
              full_name: profile?.full_name,
              role: profile?.role,
              email: session.user.email || '',
            } : null,
            loading: false,
            error: null,
          })
        } else if (event === 'SIGNED_OUT' && mounted) {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return authState
}

// Componente para proteger rutas
import { Navigate, useLocation } from 'react-router'
import { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-[14px] text-[#757575]">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
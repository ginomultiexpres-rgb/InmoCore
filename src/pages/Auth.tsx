// Página de Login / Registro para InmoCore
import { useState, useEffect } from 'react'
import { signIn, signUp, getCurrentUser } from "../lib/supabase";
import { useNavigate } from 'react-router'

interface User {
  id: string
  email: string
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Verificar sesión existente
  useEffect(() => {
    getCurrentUser().then(async (user) => {
      if (user) {
        navigate('/')
      }
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess('')

    try {
      if (isLogin) {
        const { data, error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        setSuccess('¡Bienvenido a InmoCore!')
        setTimeout(() => navigate('/'), 1000)
      } else {
        const { data, error: signUpError } = await signUp(email, password, fullName)
        if (signUpError) throw signUpError
        setSuccess('¡Cuenta creada con éxito! Verifica tu correo.')
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E88E5] via-[#2196F3] to-[#64B5F6] p-6">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            InmoCore
          </h1>
          <p className="text-white/80 text-lg">
            CRM inmobiliario inteligente
          </p>
        </div>

        {/* Card de autenticación */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#1E88E5] px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="text-white/75 text-center mt-2 text-sm">
              {isLogin ? 'Ingresa tus credenciales para continuar' : 'Comienza a gestionar tus propiedades'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Campos */}
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#424242] mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] outline-none transition-all bg-[#FAFAFA]"
                    placeholder="Juan Pérez"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#424242] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] outline-none transition-all bg-[#FAFAFA]"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#424242] mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] outline-none transition-all bg-[#FAFAFA]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Mensajes */}
            {error && (
              <div className="bg-[#FDECEA] border border-[#F57B7B] text-[#D32F2F] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#E8F5E9] border border-[#81C784] text-[#2E7D32] px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                isLogin ? 'Iniciar sesión' : 'Registrarse'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#FAFAFA] border-t border-[#E0E0E0] text-center">
            <p className="text-[#757575] text-sm">
              {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setSuccess('')
                }}
                className="text-[#1E88E5] font-semibold hover:text-[#1565C0] transition-colors"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 InmoCore. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
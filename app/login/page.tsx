// app/login/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // التحقق من وجود مستخدم مسجل الدخول
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push('/dashboard')
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.user) {
      // توجيه فوري بعد نجاح تسجيل الدخول
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - بدون دائرة صفراء وبدون كتابة Auto-Loc */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center flex-wrap gap-4">
          {/* Logo فقط - بدون دائرة صفراء، بدون كتابة */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Auto-Loc" 
              className="w-30 h-14 object-cover rounded-full" 
            />
          </Link>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/" className="nav-link-btn">
              <i className="fas fa-home"></i> Accueil
            </Link>
            <Link href="/voitures" className="nav-link-btn">
              Voitures
            </Link>
            <Link href="/login" className="auth-btn-gold">
              <i className="fas fa-user-circle"></i> Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Formulaire de connexion */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2"><i className="fas fa-car-side text-[#c7a13b]"></i></div>
            <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
            <p className="text-gray-500 mt-1">Connectez-vous à votre compte Auto-Loc</p>
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a13b] text-gray-900" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c7a13b] text-gray-900" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#c7a13b] hover:bg-[#a07e2c] text-black font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Pas encore de compte? <Link href="/register" className="text-[#c7a13b] hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">
          &copy; 2025 Auto-Loc - Location de véhicules premium en Algérie.
        </div>
      </footer>
    </div>
  )
}
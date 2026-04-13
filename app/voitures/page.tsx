// app/voitures/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Voiture {
  id: number
  marque: string
  modele: string
  prix_par_jour: number
  image_url: string
  disponible: boolean
}

export default function VoituresPage() {
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // الاستماع لتغيرات حالة المستخدم (تسجيل دخول/خروج)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // جلب المستخدم الحالي
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    
    fetchVoitures()

    return () => subscription.unsubscribe()
  }, [])

  const fetchVoitures = async () => {
    setLoading(true)
    const { data } = await supabase.from('voitures').select('*').eq('disponible', true)
    setVoitures(data || [])
    setLoading(false)
  }

  // دالة الخروج المعدلة
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
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
            <Link href="/voitures" className="nav-link-btn text-[#c7a13b] border-[#c7a13b]">
              Voitures
            </Link>
            {user && (
              <Link href="/dashboard" className="nav-link-btn">
                Tableau de bord
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="auth-btn-gold">
                <i className="fas fa-sign-out-alt"></i> Déconnexion
              </button>
            ) : (
              <Link href="/login" className="auth-btn-gold">
                <i className="fas fa-user-circle"></i> Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Nos voitures disponibles</h1>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : voitures.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune voiture disponible.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voitures.map((v) => (
              <div key={v.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <img src={v.image_url || 'https://picsum.photos/400/300'} alt={v.modele} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800">{v.marque} {v.modele}</h2>
                  <p className="text-2xl font-bold text-[#c7a13b] mt-2">{v.prix_par_jour} DA / jour</p>
                  {user ? (
                    <Link href={`/reservation/${v.id}`} className="block text-center bg-[#c7a13b] hover:bg-[#a07e2c] text-black font-semibold py-2 rounded-lg mt-4 transition">Réserver</Link>
                  ) : (
                    <Link href="/login" className="block text-center bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg mt-4 transition">Connectez-vous</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">
          &copy; 2025 Auto-Loc - Location de véhicules premium.
        </div>
      </footer>
    </div>
  )
}
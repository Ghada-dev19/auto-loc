// app/dashboard/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Reservation {
  id: number
  voiture_id: number
  date_debut: string
  date_fin: string
  statut: string
  photo_permis_url: string
  voiture: {
    marque: string
    modele: string
    prix_par_jour: number
    image_url: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // الاستماع لتغيرات حالة المستخدم (حل احترافي)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // جلب البيانات عند تحميل الصفحة أو تغير المستخدم
  useEffect(() => {
    if (user) {
      fetchReservations(user.id)
    } else {
      checkUser()
    }
  }, [user])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/login')
    } else {
      setUser(data.user)
      fetchReservations(data.user.id)
    }
  }

  const fetchReservations = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('reservations')
      .select(`*, voiture:voiture_id (marque, modele, prix_par_jour, image_url)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setReservations(data || [])
    setLoading(false)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'confirme': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // دالة الخروج المعدلة
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)        // إفراغ حالة المستخدم
    router.push('/')     // التوجيه للصفحة الرئيسية
    router.refresh()     // تحديث الصفحة
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
            <Link href="/dashboard" className="nav-link-btn text-[#c7a13b] border-[#c7a13b]">
              Tableau de bord
            </Link>
            <button onClick={handleLogout} className="auth-btn-gold">
              <i className="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mon tableau de bord</h1>
          <Link href="/voitures" className="bg-[#c7a13b] hover:bg-[#a07e2c] text-black font-semibold px-6 py-2 rounded-lg transition">
            + Nouvelle réservation
          </Link>
        </div>

        {user && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes informations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><p className="text-gray-500 text-sm">Email</p><p className="text-gray-800 font-medium">{user.email}</p></div>
              <div><p className="text-gray-500 text-sm">Membre depuis</p><p className="text-gray-800 font-medium">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-800">Mes réservations</h2></div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500 mb-4">Aucune réservation</p><Link href="/voitures" className="bg-[#c7a13b] text-black px-6 py-2 rounded-lg">Réserver</Link></div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reservations.map((res) => (
                <div key={res.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-4">
                      <img src={res.voiture?.image_url || 'https://picsum.photos/80/80'} className="w-20 h-20 object-cover rounded-lg" />
                      <div><h3 className="text-lg font-semibold text-gray-800">{res.voiture?.marque} {res.voiture?.modele}</h3>
                      <p className="text-gray-500 text-sm">{new Date(res.date_debut).toLocaleDateString('fr-FR')} → {new Date(res.date_fin).toLocaleDateString('fr-FR')}</p>
                      <p className="text-[#c7a13b] font-semibold">{res.voiture?.prix_par_jour} DA / jour</p></div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(res.statut)}`}>{res.statut === 'en_attente' ? 'En attente' : 'Confirmé'}</span>
                      {res.photo_permis_url && <a href={res.photo_permis_url} target="_blank" className="text-[#c7a13b] text-sm hover:underline">Voir le permis</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">
          &copy; 2025 Auto-Loc - Location de véhicules premium.
        </div>
      </footer>
    </div>
  )
}
// app/reservation/[id]/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Voiture {
  id: number
  marque: string
  modele: string
  prix_par_jour: number
  image_url: string
}

export default function ReservationPage() {
  const [voiture, setVoiture] = useState<Voiture | null>(null)
  const [user, setUser] = useState<any>(null)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [photoPermis, setPhotoPermis] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const voitureId = params.id

  // الاستماع لتغيرات حالة المستخدم (تسجيل دخول/خروج)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push('/login')
      }
    })

    checkUser()
    if (voitureId) fetchVoiture()

    return () => subscription.unsubscribe()
  }, [voitureId, router])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/login')
    } else {
      setUser(data.user)
    }
  }

  const fetchVoiture = async () => {
    const { data } = await supabase.from('voitures').select('*').eq('id', voitureId).single()
    if (data) setVoiture(data)
  }

  const calculerPrixTotal = () => {
    if (!dateDebut || !dateFin || !voiture) return 0
    const jours = Math.ceil((new Date(dateFin).getTime() - new Date(dateDebut).getTime()) / (1000 * 3600 * 24))
    return jours > 0 ? jours * voiture.prix_par_jour : 0
  }

  // دالة الخروج المعدلة
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!photoPermis) { setError('Veuillez uploader votre permis'); setLoading(false); return }
    if (!dateDebut || !dateFin) { setError('Choisissez les dates'); setLoading(false); return }

    try {
      const fileExt = photoPermis.name.split('.').pop()
      const fileName = `${user.id}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('permis_photos').upload(fileName, photoPermis)
      if (uploadError) throw new Error('Erreur upload')
      const { data: urlData } = supabase.storage.from('permis_photos').getPublicUrl(fileName)
      const { error: reservationError } = await supabase.from('reservations').insert({
        user_id: user.id, voiture_id: voitureId, date_debut: dateDebut, date_fin: dateFin, statut: 'en_attente', photo_permis_url: urlData.publicUrl
      })
      if (reservationError) throw new Error('Erreur réservation')
      alert('Réservation effectuée !')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  if (!voiture) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Chargement...</div></div>

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
            <Link href="/dashboard" className="nav-link-btn">
              Tableau de bord
            </Link>
            <button onClick={handleLogout} className="auth-btn-gold">
              <i className="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Réserver une voiture</h1>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2"><img src={voiture.image_url || 'https://picsum.photos/400/300'} className="w-full h-64 md:h-full object-cover" /></div>
              <div className="md:w-1/2 p-6">
                <h2 className="text-2xl font-bold text-gray-800">{voiture.marque} {voiture.modele}</h2>
                <p className="text-3xl font-bold text-[#c7a13b] mt-2">{voiture.prix_par_jour} DA / jour</p>
                <form onSubmit={handleReservation} className="mt-6 space-y-4">
                  <div><label className="block text-gray-700 font-medium mb-2">Date de début</label><input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c7a13b] text-gray-900" required /></div>
                  <div><label className="block text-gray-700 font-medium mb-2">Date de fin</label><input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c7a13b] text-gray-900" required /></div>
                  <div><label className="block text-gray-700 font-medium mb-2">Photo du permis</label><input type="file" accept="image/*" onChange={(e) => setPhotoPermis(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required /></div>
                  {dateDebut && dateFin && calculerPrixTotal() > 0 && (<div className="bg-[#c7a13b]/10 p-4 rounded-lg"><p className="text-lg font-semibold text-[#c7a13b]">Prix total: {calculerPrixTotal()} DA</p></div>)}
                  {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full bg-[#c7a13b] hover:bg-[#a07e2c] text-black font-semibold py-3 rounded-lg transition">{loading ? 'Traitement...' : 'Confirmer'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">&copy; 2025 Auto-Loc - Location de véhicules premium.</div>
      </footer>
    </div>
  )
}
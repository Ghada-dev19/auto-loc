// app/page.tsx
'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navbar - بدون دائرة صفراء وبدون كتابة Auto-Loc */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center flex-wrap gap-4">
          {/* Logo فقط - بدون دائرة صفراء، بدون كتابة، أكبر شويا */}
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

            {user && (
              <Link href="/dashboard" className="nav-link-btn">
                Tableau de bord
              </Link>
            )}

            {user ? (
              <button onClick={() => supabase.auth.signOut()} className="auth-btn-gold">
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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format")' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 to-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              Auto-Loc <span className="text-[#c7a13b]">L'élite de la location</span>
            </h1>
            <p className="text-xl text-[#f3e5c0] mb-4">Conduisez l'excellence, vivez le luxe</p>
            <p className="text-gray-200 mb-8">
              Flotte premium de véhicules récents, service 24/7 et assistance routière. 
              Découvrez une expérience de location unique en Algérie.
            </p>
            <Link href="/voitures" className="btn-primary inline-flex">
              <i className="fas fa-key"></i> Voir nos voitures
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="section-title about-title" style={{ color: '#ffffff' }}>
            À propos d'Auto-Loc
          </h2>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="text-gray-600 mb-4">
                Fondée en 2015 en Algérie, Auto-Loc est devenue la référence en matière de location de voitures haut de gamme. 
                Nous allions élégance, performance et service d'exception pour une clientèle exigeante.
              </p>
              <p className="text-gray-600">
                Notre flotte moderne est composée de berlines luxueuses, SUV sportifs et véhicules premium. 
                Nous assurons un service 24h/24, 7j/7, avec une assistance routière et une garantie de prix compétitifs.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="service-item"><i className="fas fa-gem text-[#c7a13b] text-2xl"></i> <span>Qualité premium</span></div>
              <div className="service-item"><i className="fas fa-tags text-[#c7a13b] text-2xl"></i> <span>Prix compétitifs</span></div>
              <div className="service-item"><i className="fas fa-wrench text-[#c7a13b] text-2xl"></i> <span>Assistance 24/7</span></div>
              <div className="service-item"><i className="fas fa-shield-alt text-[#c7a13b] text-2xl"></i> <span>Assurance tous risques</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="section-title text-gray-800">Ce que nos clients disent</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c7a13b] to-[#cb9e4a] rounded-full flex items-center justify-center text-2xl font-bold text-black">L</div>
                <div>
                  <strong>Lina Mansouri</strong>
                  <div className="text-[#c7a13b]"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                </div>
              </div>
              <p className="italic" style={{ color: '#111827' }}>
                "Service impeccable, voiture flambant neuve et livrée à mon hôtel. Je recommande Auto-Loc pour les voyages d'affaires !"
              </p>
            </div>
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c7a13b] to-[#cb9e4a] rounded-full flex items-center justify-center text-2xl font-bold text-black">R</div>
                <div>
                  <strong>Rafik Benali</strong>
                  <div className="text-[#c7a13b]"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i></div>
                </div>
              </div>
              <p className="italic" style={{ color: '#111827' }}>
                "Flotte luxueuse et tarifs raisonnables. L'assistance routière a été réactive. Une référence en Algérie."
              </p>
            </div>
            <div className="testimonial-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c7a13b] to-[#cb9e4a] rounded-full flex items-center justify-center text-2xl font-bold text-black">S</div>
                <div>
                  <strong>Sofia Khelifi</strong>
                  <div className="text-[#c7a13b]"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                </div>
              </div>
              <p className="italic" style={{ color: '#111827' }}>
                "J'ai adoré le service de prise en charge à l'aéroport. Professionnalisme et élégance, je reviendrai !"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - بدون دائرة صفراء وبدون كتابة Auto-Loc */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Auto-Loc" 
                  className="w-30 h-14 object-cover rounded-full" 
                />
                {/* <span className="text-xl font-extrabold text-white">Auto-Loc</span> - محذوف */}
              </div>
              <p className="text-slate-400"><i className="fas fa-map-marker-alt mr-2"></i> 05, Boulevard des Cèdres, Hydra, Alger</p>
              <p className="text-slate-400"><i className="fas fa-phone-alt mr-2"></i> +213 (0) 23 45 67 89</p>
              <p className="text-slate-400"><i className="fas fa-envelope mr-2"></i> contact@auto-loc.dz</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-slate-500 hover:text-[#c7a13b] text-xl transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-slate-500 hover:text-[#c7a13b] text-xl transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-slate-500 hover:text-[#c7a13b] text-xl transition"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#c7a13b]">Horaires d'ouverture</h4>
              <p className="text-slate-400">Lundi - Dimanche : 24h/24</p>
              <p className="text-slate-400">Service client 7j/7</p>
              <p className="text-slate-400 mt-2">Assistance routière : +213 551 00 11 22</p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-800 text-slate-500 text-sm">
            <p>&copy; 2025 Auto-Loc - Location de véhicules premium en Algérie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
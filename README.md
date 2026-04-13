# 🚗 Auto-Loc - Plateforme de location de voitures en Algérie

## 📝 Description du projet
Auto-Loc est une application web de location de voitures permettant aux clients de consulter un catalogue de véhicules, de réserver une voiture et de télécharger leur permis de conduire. Chaque client dispose d’un tableau de bord personnel pour suivre ses réservations.

---

## 🗂️ Mapping du projet (conformément aux exigences du cours)

| Élément | Table / Stockage | Rôle |
|---------|----------------|------|
| **Table A (Utilisateurs)** | `auth.users` (gérée par Supabase Auth) | Clients de l’agence |
| **Table B (Ressources)** | `voitures` | Véhicules disponibles à la location |
| **Table C (Interactions)** | `reservations` | Réservations effectuées par les clients |
| **Fichier (Storage)** | Bucket `permis_photos` | Photo du permis de conduire (upload) |

✅ **Relations** :  
- `reservations.user_id` → `auth.users.id`  
- `reservations.voiture_id` → `voitures.id`  

✅ **Row Level Security (RLS)** : activée sur `reservations`. Chaque utilisateur ne peut voir que ses propres réservations (`auth.uid() = user_id`).

---

## 🏗️ Analyse d’architecture (cours)

### 1. Pourquoi Vercel + Supabase plutôt qu’un serveur classique (CAPEX / OPEX) ?
- **CAPEX** (dépenses d’investissement) : avec un serveur physique, il faut acheter le matériel, payer la climatisation, l’électricité, et un administrateur système.  
- **OPEX** (dépenses opérationnelles) : avec Vercel + Supabase, on ne paie que **l’utilisation** (gratuit pour ce projet). Pas d’investissement initial.  
- **Conclusion** : pour un lancement rapide et sans budget, le modèle serverless (OPEX) est bien plus logique.

### 2. Scalabilité : Vercel vs Data Center local
- **Vercel** : scale automatiquement (plus de requêtes → plus de serveurs instantanément).  
- **Data Center local** : il faut acheter des serveurs supplémentaires, les installer, les refroidir → lenteur et coût élevé.  
- Vercel gère aussi la répartition géographique (CDN) pour un accès rapide depuis n’importe où.

### 3. Données structurées / non structurées dans l’application
- **Données structurées** : les tables SQL (`voitures`, `reservations`) avec des colonnes bien définies (prix, dates, statut…).  
- **Données non structurées** : l’image du permis de conduire (fichier PNG/JPEG) stockée dans Supabase Storage.

---

## 🔐 Comptes de test (pour l’enseignant)

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `client1@autoloc.com` | `test123456` | Client standard |
| `client2@autoloc.com` | `test123456` | Client standard |

> Ces comptes sont déjà créés dans Supabase. Vous pouvez également vous inscrire librement.

---

## 🛠️ Stack technique utilisée

- **Frontend** : Next.js 15 (React, TypeScript, Tailwind CSS)
- **Backend & BaaS** : Supabase (PostgreSQL, Auth, Storage, RLS)
- **Hébergement & CI/CD** : Vercel (déploiement automatique à chaque `git push`)

---

## 🚀 Lien vers l’application déployée

🔗 [https://auto-loc-xxxx.vercel.app](https://auto-loc-bejr.vercel.app/)  
*(Remplacez `xxxx` par votre URL réelle fournie par Vercel)*

---

## 👥 Auteurs (Binôme)

- **Nom Étudiant 1** : Gherraz Ghada
- **Nom Étudiant 2** : Serir Dalia

---

**Date de rendu :** 10/05/2026  
**Module :** Systèmes d’Information – 2ème année CP

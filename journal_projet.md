# Journal de projet — Périgueux Access

## Présentation

**Périgueux Access** est un SaaS citoyen qui recense l'accessibilité des lieux publics de Périgueux (et du Grand Périgueux) pour les personnes en situation de handicap moteur, visuel, auditif ou cognitif.

- **URL prod** : à renseigner
- **Dépôt** : https://github.com/Perigueux-access/perigueux-access
- **Branche principale** : `main`

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| UI | React | ^18.2.0 |
| Bundler | Vite | ^5.4.1 |
| Déploiement | Vercel | — |
| Base de données | Supabase | à intégrer |
| CAPTCHA | Cloudflare Turnstile (`@marsidev/react-turnstile`) | ^1.1.0 |
| Icônes | lucide-react | ^0.400.0 |
| Plugin Claude | caveman (JuliusBrussee/caveman) | 84cc3c14fa1e |

---

## Architecture actuelle

### Fichier principal

`src/PerigueuxAccess.jsx` — **monolithique, ~3 500 lignes**

| Composant / Section | Lignes approx. | Rôle |
|---|---|---|
| `SEED_PLACES` | 11–147 | Données statiques : 60+ lieux de Périgueux |
| Config (`TYPES`, `DISABILITIES`, `EQUIPMENT_LABELS`, `LEVELS`, `BADGES`) | 153–260 | Constantes de configuration |
| Helpers (`getLevel`, `haversine`, `normalize`, `storage`) | 219–260 | Utilitaires |
| `ReviewForm` | 261–397 | Formulaire d'avis + Turnstile CAPTCHA |
| `PerigueuxAccess` (racine) | 398–1397 | État global, navigation, logique XP/gamification |
| `MapView` | 1398–1601 | Carte + filtres + liste des lieux |
| `useGooglePhotos` | 1602–1669 | Hook : fetch Google Places API, cache localStorage 24h |
| `PlaceDetail` | 1674–2066 | Détail d'un lieu : carrousel photos, reviews, check-in |
| `ProfileView` | 2067–2301 | Profil, XP, niveaux, favoris |
| `DiabeteView` + sous-tabs | 2302–2873 | Section diabète (sucre, médecins, labo, carnet glycémie) |
| `LegalView` | 2874–3250 | Mentions légales |
| `LeaderboardView` | 3267–3338 | Classement |
| `AddPlaceView` | 3339–3473 | Ajout d'un lieu |

### Endpoint API

`/api/google-photos` — serverless Vercel, fetch photos Google Places par nom/adresse.

---

## Historique des décisions techniques

### 2026-04-26 — Session de démarrage

**Fix : flash d'images dans `PlaceDetail`** (`commit bd9dbdb`)
- Problème : le carrousel n'existait pas dans le DOM tant que `photos` était vide → saut de layout brutal à l'arrivée des photos.
- Solution : skeleton gris réservant l'espace dès `photosLoading === true` + fade-in `opacity 0→1` via `onLoad` + reset `imgLoaded` sur changement de lieu/photo.
- Fichiers modifiés : `src/PerigueuxAccess.jsx` (lignes 1679–1812)

**Fix : import dupliqué `X`** (`commit 26c70eb`)
- `X` de `lucide-react` importé deux fois dans la même ligne de destructuring.
- Suppression du doublon en fin de liste.

---

## Dette technique connue

| Priorité | Problème | Impact |
|---|---|---|
| 🔴 Haute | Fichier monolithique 3 500 lignes | Maintenabilité, DX |
| 🔴 Haute | Données `SEED_PLACES` en dur dans le JSX | Pas de persistance, pas de CRUD |
| 🟠 Moyenne | Pas d'ESLint ni Prettier | Qualité du code non enforced |
| 🟠 Moyenne | Pas de Supabase intégré | Données volatiles, pas de backend réel |
| 🟡 Faible | `storage` (localStorage) comme pseudo-base | À migrer vers Supabase |
| 🟡 Faible | Styles 100% inline | Pas de design system, duplication |

---

## Roadmap — Phase 1 : Hygiène du code (à venir)

> **Règle** : aucune modification sans plan validé, commit avant chaque étape importante.

### Étape 1.1 — ESLint + Prettier
- Installer `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`
- Config : `.eslintrc.cjs` + `.prettierrc`
- Valider sur le fichier existant sans modifier la logique

### Étape 1.2 — Découpage du monolithe
Ordre suggéré (du moins risqué au plus risqué) :

1. `src/data/places.js` — extraire `SEED_PLACES`
2. `src/constants/index.js` — extraire `TYPES`, `DISABILITIES`, `EQUIPMENT_LABELS`, `LEVELS`, `BADGES`
3. `src/utils/index.js` — extraire `getLevel`, `haversine`, `normalize`, `storage`
4. `src/hooks/useGooglePhotos.js` — extraire le hook
5. `src/components/PlaceImage.jsx` — composant dédié au carrousel (encapsule le fix flash)
6. `src/components/ReviewForm.jsx` — déjà isolable proprement
7. `src/components/MapView.jsx`
8. `src/components/PlaceDetail.jsx`
9. `src/components/ProfileView.jsx`
10. `src/components/DiabeteView/` — dossier avec sous-composants (SucreTab, MedecinsTab, LaboTab, CarnetTab)
11. `src/components/LegalView.jsx`
12. `src/components/LeaderboardView.jsx`
13. `src/components/AddPlaceView.jsx`

### Étape 1.3 — Composant `PlaceImage`
Encapsule toute la logique photos :
- `useGooglePhotos` hook
- Skeleton de chargement
- Carrousel avec pagination
- Fade-in sur `onLoad`
- Badge "📸 Google"
- Bouton retour superposé

### Étape 1.4 — Intégration Supabase (Phase 2)
- Migration `SEED_PLACES` → table `places` Supabase
- Migration `storage` (localStorage) → auth Supabase + table `profiles`
- Reviews persistées en base

---

## Conventions du projet

- **Langue** : français pour les réponses, commentaires de code en français
- **Commits** : format `type: description` (fix, feat, chore, refactor)
- **Branches** : travailler sur `main` pour l'instant (projet solo)
- **Plan avant code** : toujours proposer un plan et attendre validation explicite

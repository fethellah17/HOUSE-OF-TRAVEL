# Zahrat Al Houda - Agence de Voyages

Bienvenue sur le dépôt de **Zahrat Al Houda**, une agence de voyages moderne proposant des expériences de voyage inoubliables.

## À propos

Zahrat Al Houda est une plateforme web dédiée à la réservation et la gestion de voyages. Notre application offre une interface intuitive pour explorer, réserver et gérer vos voyages en toute simplicité.

## Technologies utilisées

Ce projet est construit avec les technologies modernes suivantes :

- **React** - Bibliothèque JavaScript pour les interfaces utilisateur
- **Vite** - Outil de build ultra-rapide
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn-ui** - Composants UI réutilisables
- **Supabase** - Backend et base de données (configuration en cours)

## Installation et démarrage

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou bun

### Étapes d'installation

```sh
# 1. Cloner le dépôt
git clone <YOUR_GIT_URL>

# 2. Naviguer vers le répertoire du projet
cd zahrat-al-houda

# 3. Installer les dépendances
npm install

# 4. Démarrer le serveur de développement
npm run dev
```

Le serveur sera accessible à `http://localhost:5173`

## Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run preview` - Prévisualiser la version de production
- `npm run lint` - Vérifier la qualité du code

## Configuration de la base de données

La base de données **Supabase** sera configurée prochainement. Les détails de configuration seront ajoutés une fois l'intégration complète.

## Structure du projet

```
src/
├── components/     # Composants React réutilisables
├── pages/         # Pages de l'application
├── contexts/      # Contextes React
├── hooks/         # Hooks personnalisés
├── lib/           # Utilitaires et fonctions
├── types/         # Définitions TypeScript
└── data/          # Données statiques
```

## Déploiement sur Vercel

Ce projet est optimisé pour un déploiement facile sur Vercel. Suivez ces étapes :

### Déploiement automatique

1. **Connecter votre dépôt Git** :
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre dépôt GitHub/GitLab/Bitbucket

2. **Configuration automatique** :
   - Vercel détectera automatiquement que c'est un projet Vite
   - Le fichier `vercel.json` configure le build et le routing SPA

3. **Déploiement** :
   - Cliquez sur "Deploy"
   - Votre application sera en ligne en quelques minutes

### Configuration du routing SPA

Le fichier `vercel.json` à la racine du projet gère automatiquement le routing Single Page Application (SPA). Toutes les requêtes sont redirigées vers `index.html`, ce qui permet à React Router de gérer la navigation sans erreurs 404.

### Variables d'environnement

Si vous avez besoin de variables d'environnement (ex: clés API Supabase) :
1. Allez dans les paramètres du projet sur Vercel
2. Ajoutez vos variables dans la section "Environment Variables"
3. Redéployez votre application

## Contribution

Les contributions sont bienvenues. Veuillez créer une branche pour vos modifications et soumettre une pull request.

## Licence

Ce projet est sous licence propriétaire. Tous les droits sont réservés à Zahrat Al Houda.

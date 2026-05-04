# Guide Visuel - Bouton "Modifier" du Profil

## Vue d'ensemble

Le bouton "Modifier" permet aux utilisateurs connectés de mettre à jour leurs informations personnelles directement depuis les formulaires de Devis et Billetterie.

---

## 📱 Interface Utilisateur

### Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│  Informations Personnelles    ✓ Pré-remplies  [✏️ Modifier] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Nom *                          Prénom *                     │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │ Benali (locked)      │      │ Ahmed (locked)       │    │
│  └──────────────────────┘      └──────────────────────┘    │
│                                                               │
│  Email *                                                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ahmed@example.com (locked)                         │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Téléphone *                                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 0600000000 (locked)                                │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (Stacked)
```
┌──────────────────────────────┐
│ Informations Personnelles    │
│                               │
│ ✓ Pré-remplies depuis profil │
│ [✏️ Modifier]                 │
├──────────────────────────────┤
│                               │
│ Nom *                         │
│ ┌──────────────────────────┐ │
│ │ Benali (locked)          │ │
│ └──────────────────────────┘ │
│                               │
│ Prénom *                      │
│ ┌──────────────────────────┐ │
│ │ Ahmed (locked)           │ │
│ └──────────────────────────┘ │
│                               │
│ ... (autres champs)           │
└──────────────────────────────┘
```

---

## 🎨 Styling du Bouton "Modifier"

### Apparence
- **Icône**: ✏️ Pencil (14px)
- **Couleur**: Navy Blue (#0a2357)
- **Taille du texte**: 12px (text-xs)
- **Padding**: 12px horizontal, 6px vertical
- **Border-radius**: 8px (rounded-lg)

### États
```css
/* Normal */
color: var(--primary);
background: transparent;

/* Hover */
color: var(--primary) / 0.8;
background: var(--primary) / 0.05;

/* Active/Click */
transform: scale(0.98);
```

### Touch Target (Mobile)
- Minimum 44x44px pour accessibilité
- `touch-manipulation` pour éviter le double-tap zoom

---

## 🔄 Flux Utilisateur

### Étape 1: Formulaire avec Auto-Fill
```
Utilisateur connecté → Formulaire charge
                    ↓
            Champs pré-remplis (bleu clair)
                    ↓
        Badge vert "✓ Pré-remplies"
                    ↓
        Bouton "Modifier" visible
```

### Étape 2: Clic sur "Modifier"
```
Clic sur [✏️ Modifier]
        ↓
LoginModal s'ouvre
        ↓
Mode "edit-profile" activé
        ↓
Champs éditables chargés
```

### Étape 3: Modal d'Édition
```
┌─────────────────────────────────────┐
│  ✕                                   │
│                                      │
│  Modifier mon Profil                │
│  Mettez à jour vos informations     │
│                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                      │
│  Nom *              Prénom *        │
│  ┌────────────┐    ┌────────────┐  │
│  │ Benali     │    │ Ahmed      │  │
│  └────────────┘    └────────────┘  │
│                                      │
│  Email *                             │
│  ┌──────────────────────────────┐  │
│  │ ahmed@example.com            │  │
│  └──────────────────────────────┘  │
│                                      │
│  Téléphone *                         │
│  ┌──────────────────────────────┐  │
│  │ 0600000000                   │  │
│  └──────────────────────────────┘  │
│                                      │
│  [Annuler]  [✓ Enregistrer]        │
└─────────────────────────────────────┘
```

### Étape 4: Sauvegarde
```
Clic sur "Enregistrer"
        ↓
Validation des champs
        ↓
Mise à jour localStorage
        ↓
Dispatch event "profileUpdated"
        ↓
Toast: "Profil mis à jour !"
        ↓
Modal se ferme
        ↓
Formulaire se met à jour automatiquement
```

---

## 💾 Synchronisation des Données

### Architecture Event-Driven

```javascript
// 1. Dans LoginModal (après sauvegarde)
localStorage.setItem("currentUser", JSON.stringify(updatedUser));
window.dispatchEvent(new Event("profileUpdated"));

// 2. Dans DevisForm & BilletteriePage
useEffect(() => {
  const handleProfileUpdate = () => {
    // Recharger les données utilisateur
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setForm(prev => ({
      ...prev,
      nom: currentUser.nom,
      prenom: currentUser.prenom,
      email: currentUser.email,
      telephone: currentUser.phone
    }));
  };
  
  window.addEventListener("profileUpdated", handleProfileUpdate);
  
  return () => {
    window.removeEventListener("profileUpdated", handleProfileUpdate);
  };
}, []);
```

### Flux de Données
```
LoginModal (Edit)
      ↓
  localStorage
      ↓
Custom Event "profileUpdated"
      ↓
DevisForm ← Event Listener → BilletteriePage
      ↓                              ↓
  Reload Data                   Reload Data
      ↓                              ↓
  Update UI                     Update UI
```

---

## 🎯 Points Clés d'Implémentation

### 1. Détection du Mode Édition
```typescript
// Dans LoginModal
useEffect(() => {
  if (isOpen && editMode) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setView("edit-profile");
    // Charger les données
  }
}, [isOpen, editMode]);
```

### 2. Bouton Conditionnel
```typescript
// Dans DevisForm & BilletteriePage
{isLoggedIn && (
  <button onClick={() => setShowLoginModal(true)}>
    <Pencil size={14} />
    <span>Modifier</span>
  </button>
)}
```

### 3. Mise à Jour en Temps Réel
```typescript
// Après sauvegarde
window.dispatchEvent(new Event("profileUpdated"));

// Dans les formulaires
window.addEventListener("profileUpdated", loadUserData);
```

---

## ✅ Checklist de Validation

### Fonctionnalités
- [x] Bouton "Modifier" visible uniquement si connecté
- [x] Modal s'ouvre en mode édition
- [x] Données utilisateur pré-chargées
- [x] Validation des champs
- [x] Sauvegarde dans localStorage
- [x] Mise à jour automatique des formulaires
- [x] Toast de confirmation

### Design
- [x] Navy Blue branding cohérent
- [x] Icône Pencil claire et visible
- [x] Touch target suffisant (mobile)
- [x] Responsive (desktop/mobile)
- [x] Animations fluides (Framer Motion)

### Accessibilité
- [x] Bouton avec aria-label approprié
- [x] Contraste de couleurs suffisant
- [x] Touch target minimum 44x44px
- [x] Focus visible au clavier
- [x] Messages d'erreur clairs

---

## 🚀 Améliorations Futures

1. **Changement de Mot de Passe**
   - Ajouter un champ "Nouveau mot de passe" dans l'édition
   - Validation de la force du mot de passe

2. **Vérification Email/Téléphone**
   - Envoyer un code de vérification avant changement
   - Confirmer la nouvelle adresse/numéro

3. **Photo de Profil**
   - Upload d'image
   - Crop et redimensionnement
   - Affichage dans le header

4. **Historique des Modifications**
   - Logger les changements de profil
   - Afficher dans l'admin panel

5. **Confirmation de Sortie**
   - Avertir si modifications non sauvegardées
   - Dialog "Êtes-vous sûr ?"

---

## 📊 Métriques de Succès

- ✅ Build réussi sans erreurs
- ✅ TypeScript validation OK
- ✅ Responsive sur tous les écrans
- ✅ Performance: Pas de re-render inutiles
- ✅ UX: Feedback immédiat à l'utilisateur

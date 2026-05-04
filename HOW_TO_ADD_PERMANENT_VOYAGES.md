# Comment Ajouter des Voyages Permanents

## 📋 Vue d'Ensemble

Avec le nouveau système de stockage, les voyages permanents doivent être ajoutés directement dans `src/data/mockData.ts` au lieu du formulaire Admin.

## 🎯 Pourquoi ?

- **Ancien système** : Admin ajoute → localStorage → persistent
- **Nouveau système** : Admin ajoute → React State → temporaire
- **Solution** : Ajouter directement dans mockData.ts → permanent

## 📝 Étapes pour Ajouter un Voyage Permanent

### Étape 1 : Ouvrir le fichier mockData.ts

```bash
src/data/mockData.ts
```

### Étape 2 : Localiser le tableau mockVoyages

```typescript
export const mockVoyages: Voyage[] = [
  // Voyages existants...
  {
    id: "1",
    title: "Omrah Ramadan 2025",
    // ...
  },
  // Ajouter le nouveau voyage ici
];
```

### Étape 3 : Ajouter le Nouveau Voyage

Copier la structure d'un voyage existant et adapter :

```typescript
{
  id: "7", // ID unique (incrémenter)
  title: "Nom du Voyage",
  imageUrl: "https://images.unsplash.com/...", // URL de l'image
  price: 1500,
  priceAdult: 1500,
  priceChild: 1000,
  description: "Description du voyage...",
  category: "Omrah", // ou "Voyage Organisé" ou "Voyage à la Carte"
  duration: "10 jours",
  date: "01/01/2025 - 10/01/2025",
  createdAt: "2024-11-20T00:00:00Z",
  status: "normal", // ou "almost-full", "limited-offer", "full"
  flightType: "Avec vol", // ou "Sans vol"
  visaRequired: "Non", // ou "Oui"
  roomType: "Double", // ou "Simple", "Triple", "Quadruple"
  mealPlan: "Pension complète", // ou "Petit-déjeuner", "Demi-pension", "All inclusive"
  stages: [ // Optionnel, requis pour Omrah et Voyage Organisé
    {
      id: "stage-7-1",
      name: "Étape 1",
      hotelName: "Nom de l'hôtel",
      googleMapsUrl: "https://maps.google.com/?q=...",
      days: 5,
    },
    {
      id: "stage-7-2",
      name: "Étape 2",
      hotelName: "Nom de l'hôtel",
      googleMapsUrl: "https://maps.google.com/?q=...",
      days: 5,
    },
  ],
}
```

## 📋 Champs Obligatoires

| Champ | Type | Exemple |
|-------|------|---------|
| `id` | string | "7" |
| `title` | string | "Omrah Février" |
| `imageUrl` | string | "https://..." |
| `price` | number | 1500 |
| `priceAdult` | number | 1500 |
| `priceChild` | number | 1000 |
| `description` | string | "Description..." |
| `category` | string | "Omrah" |
| `duration` | string | "10 jours" |
| `date` | string | "01/01/2025 - 10/01/2025" |
| `createdAt` | string | "2024-11-20T00:00:00Z" |

## 📋 Champs Optionnels

| Champ | Type | Exemple |
|-------|------|---------|
| `status` | string | "normal" |
| `flightType` | string | "Avec vol" |
| `visaRequired` | string | "Non" |
| `roomType` | string | "Double" |
| `mealPlan` | string | "Pension complète" |
| `stages` | array | [...] |
| `imageUrls` | array | [...] |

## 🎨 Valeurs Possibles

### category
- `"Omrah"`
- `"Voyage Organisé"`
- `"Voyage à la Carte"`

### status
- `"normal"` (par défaut)
- `"almost-full"` (presque complet)
- `"limited-offer"` (offre limitée)
- `"full"` (complet)

### flightType
- `"Avec vol"`
- `"Sans vol"`

### visaRequired
- `"Oui"`
- `"Non"`

### roomType
- `"Simple"`
- `"Double"`
- `"Triple"`
- `"Quadruple"`

### mealPlan
- `"Petit-déjeuner"`
- `"Demi-pension"`
- `"Pension complète"`
- `"All inclusive"`

## 🏨 Étapes (Stages)

### Requis pour
- Omrah
- Voyage Organisé

### Optionnel pour
- Voyage à la Carte

### Structure
```typescript
stages: [
  {
    id: "stage-7-1", // ID unique
    name: "Nom de l'étape",
    hotelName: "Nom de l'hôtel",
    googleMapsUrl: "https://maps.google.com/?q=...",
    days: 5, // Nombre de jours
    icon?: "kaaba" | "dome", // Optionnel
  },
]
```

## 📸 Images

### Recommandations
- Format : JPG, PNG
- Taille : ~800x600px
- Poids : < 500KB
- Source : Unsplash, Pexels, etc.

### Exemple d'URL
```
https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80
```

## 📅 Dates

### Format
```
"JJ/MM/YYYY - JJ/MM/YYYY"
```

### Exemple
```
"01/03/2025 - 14/03/2025"
```

### Calcul de la Durée
```
Durée = (Date fin - Date début) + 1 jour
Exemple : 14/03 - 01/03 = 13 jours + 1 = 14 jours
```

## 🔍 Exemple Complet

```typescript
{
  id: "7",
  title: "Égypte Ancienne",
  imageUrl: "https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=800&q=80",
  price: 1200,
  priceAdult: 1200,
  priceChild: 800,
  description: "Découvrez les merveilles de l'Égypte ancienne : les pyramides de Gizeh, le Sphinx, la Vallée des Rois et les temples de Louxor.",
  category: "Voyage Organisé",
  duration: "8 jours",
  date: "15/04/2025 - 22/04/2025",
  createdAt: "2024-11-20T00:00:00Z",
  status: "normal",
  flightType: "Avec vol",
  visaRequired: "Oui",
  roomType: "Double",
  mealPlan: "Pension complète",
  stages: [
    {
      id: "stage-7-1",
      name: "Le Caire",
      hotelName: "Nile Hilton Cairo",
      googleMapsUrl: "https://maps.google.com/?q=Nile+Hilton+Cairo",
      days: 3,
    },
    {
      id: "stage-7-2",
      name: "Louxor",
      hotelName: "Sofitel Winter Palace Luxor",
      googleMapsUrl: "https://maps.google.com/?q=Sofitel+Winter+Palace+Luxor",
      days: 3,
    },
    {
      id: "stage-7-3",
      name: "Assouan",
      hotelName: "Sofitel Legend Old Cataract Aswan",
      googleMapsUrl: "https://maps.google.com/?q=Sofitel+Legend+Old+Cataract+Aswan",
      days: 2,
    },
  ],
}
```

## ✅ Checklist Avant de Sauvegarder

- [ ] ID unique (pas de doublon)
- [ ] Tous les champs obligatoires remplis
- [ ] Dates au format correct (JJ/MM/YYYY)
- [ ] Durée correcte (correspond aux dates)
- [ ] Étapes remplies (si Omrah ou Voyage Organisé)
- [ ] Somme des jours des étapes = durée totale
- [ ] Image URL valide
- [ ] Pas d'erreurs de syntaxe TypeScript

## 🚀 Après Modification

### 1. Sauvegarder le fichier
```bash
Ctrl+S (ou Cmd+S)
```

### 2. Vérifier la compilation
```bash
npm run build
```

### 3. Tester localement
```bash
npm run dev
```

### 4. Vérifier le voyage
- Aller sur la page d'accueil
- Vérifier que le nouveau voyage apparaît
- Cliquer dessus pour vérifier les détails

### 5. Déployer
```bash
npm run build
# Déployer selon votre processus
```

## 🐛 Dépannage

### Le voyage n'apparaît pas
1. Vérifier que le fichier a été sauvegardé
2. Vérifier qu'il n'y a pas d'erreurs TypeScript
3. Vérifier que l'ID est unique
4. Vérifier la console pour les erreurs

### Erreur de compilation
1. Vérifier la syntaxe TypeScript
2. Vérifier que tous les champs obligatoires sont présents
3. Vérifier les guillemets et virgules
4. Vérifier le format des dates

### Le voyage apparaît mais les détails sont vides
1. Vérifier que tous les champs sont remplis
2. Vérifier que les étapes sont correctes
3. Vérifier que la somme des jours des étapes = durée

## 📞 Support

En cas de problème :
1. Consulter les exemples existants dans mockData.ts
2. Vérifier la structure du type `Voyage` dans `src/types.ts`
3. Vérifier la console pour les erreurs
4. Tester avec un voyage simple d'abord

## 💡 Conseils

1. **Copier-coller** : Copier un voyage existant et adapter
2. **Tester** : Tester localement avant de déployer
3. **Dates** : Vérifier que les dates sont réalistes
4. **Images** : Utiliser des images de bonne qualité
5. **Description** : Écrire une description attrayante

## 🎉 Résultat

Une fois sauvegardé et déployé, le nouveau voyage sera :
- ✅ Visible sur la page d'accueil
- ✅ Accessible via le lien direct
- ✅ Modifiable via l'Admin
- ✅ Permanent (ne disparaît pas après refresh)

---

**Note** : Les voyages ajoutés via le formulaire Admin sont temporaires et disparaissent après refresh. Pour les rendre permanents, les ajouter dans mockData.ts.

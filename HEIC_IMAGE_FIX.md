# Fix: Support HEIC/HEIF et Compression d'Images pour iPhone

## Problème Résolu
- ✅ Support des images HEIC/HEIF natives d'iOS
- ✅ Conversion automatique HEIC → JPEG côté client
- ✅ Compression et redimensionnement automatiques
- ✅ Indicateur de chargement pendant le traitement
- ✅ Gestion des images trop volumineuses (> 2MB)

## Changements Implémentés

### 1. Nouvelle Dépendance
```bash
npm install heic2any
```

### 2. Nouveaux Fichiers

#### `src/lib/imageProcessor.ts`
Bibliothèque complète de traitement d'images avec :
- **`isHeicFormat(file)`** : Détecte les formats HEIC/HEIF
- **`convertHeicToJpeg(file)`** : Convertit HEIC en JPEG
- **`resizeImage(img)`** : Redimensionne si > 1920px
- **`compressImage(canvas)`** : Compresse avec qualité adaptée
- **`processImage(file)`** : Pipeline complet de traitement
- **`processImageToBase64(file)`** : Retourne base64 directement
- **`formatFileSize(bytes)`** : Formate la taille lisible

#### `src/components/LoadingSpinner.tsx`
Composant spinner réutilisable avec :
- Animations fluides (Framer Motion)
- Messages de progression personnalisés
- Mode plein écran optionnel
- Tailles configurables (sm, md, lg)

### 3. Composants Mis à Jour

#### `src/components/ImageUpload.tsx`
- ✅ Support HEIC/HEIF dans l'input file
- ✅ Traitement automatique avec `processImageToBase64()`
- ✅ Spinner avec message "Conversion HEIC en cours..." ou "Compression..."
- ✅ Messages d'erreur détaillés

#### `src/components/MultiImageUpload.tsx`
- ✅ Support HEIC/HEIF pour uploads multiples
- ✅ Traitement parallèle des images
- ✅ Spinner avec message "Traitement de X image(s)..."
- ✅ Gestion des erreurs améliorée

## Flux de Traitement

```
Fichier HEIC/HEIF
    ↓
[Détection format]
    ↓
[Conversion HEIC → JPEG] (si nécessaire)
    ↓
[Chargement en mémoire]
    ↓
[Redimensionnement si > 1920px]
    ↓
[Compression JPEG avec qualité adaptée]
    ↓
[Réduction qualité si > 2MB]
    ↓
[Conversion en Base64]
    ↓
✅ Prêt pour upload
```

## Spécifications Techniques

| Paramètre | Valeur |
|-----------|--------|
| Dimensions max | 1920 x 1920 px |
| Taille max | 2 MB |
| Qualité JPEG | 85% (ajustable) |
| Formats acceptés | JPEG, PNG, HEIC, HEIF |

## Utilisation

### ImageUpload (image unique)
```tsx
import { ImageUpload } from "@/components/ImageUpload";

<ImageUpload 
  value={imageUrl}
  onChange={setImageUrl}
  label="Photo du voyage"
  required
/>
```

### MultiImageUpload (images multiples)
```tsx
import { MultiImageUpload } from "@/components/MultiImageUpload";

<MultiImageUpload 
  value={images}
  onChange={setImages}
  maxFiles={10}
  label="Photos du voyage"
/>
```

## Avantages

1. **Compatibilité iPhone** : Les photos HEIC sont automatiquement converties
2. **Performance** : Images compressées = chargement plus rapide
3. **UX** : Spinner indique le traitement en cours
4. **Fiabilité** : Gestion des erreurs robuste
5. **Flexibilité** : Qualité adaptée à la taille du fichier

## Tests Recommandés

1. Upload HEIC depuis iPhone réel
2. Upload PNG/JPEG depuis PC
3. Upload images > 2MB (vérifier compression)
4. Upload images > 1920px (vérifier redimensionnement)
5. Drag & drop multiple
6. Vérifier les messages d'erreur

## Notes

- La conversion HEIC est transparente pour l'utilisateur
- Les images sont traitées côté client (pas de serveur requis)
- Le spinner affiche le message approprié selon le traitement
- Les erreurs sont affichées via toast notifications

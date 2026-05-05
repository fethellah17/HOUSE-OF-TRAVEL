# 🎨 Omrah Configuration - Visual Guide

## Complete Reservation System Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    OMRAH RESERVATION SYSTEM                     │
│                  (Complete Multi-Section Form)                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🏨 CONFIGURATION HÔTEL                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Background: Navy Blue/Sage Green gradient                      │
│  Border: Sage Green                                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Type d'Hôtel │  │ Distance du  │  │ Type de      │         │
│  │              │  │ Haram        │  │ Chambre      │         │
│  │ ⭐⭐⭐⭐ 4★  │  │              │  │              │         │
│  │ ⭐⭐⭐⭐⭐ 5★│  │ 🕌 Proche    │  │ 🛏️ Double    │         │
│  │              │  │ 🚶 Moyenne   │  │ 🛏️🛏️ Triple │         │
│  │              │  │              │  │ 🛏️🛏️🛏️ Quad│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ Nombre de Chambres *                               │        │
│  │ [  2  ]  (Number input, 1-10)                      │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  👥 PASSAGERS                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Background: Blue gradient                                      │
│  Border: Blue                                                   │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ Nombre d'Adultes *   │  │ Nombre d'Enfants     │           │
│  │ [  4  ]              │  │ [  2  ]              │           │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ Âge des Enfants * (Appears if children > 0)       │        │
│  │ [  5 ans, 8 ans  ]                                 │        │
│  │ 💡 Séparez les âges par des virgules              │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                 │
│  [Animated entrance with Framer Motion]                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🍽️ PENSION                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Background: Amber/Orange gradient                              │
│  Border: Amber                                                  │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ Type de Pension *                                  │        │
│  │                                                    │        │
│  │ 🥐 Petit Déjeuner                                 │        │
│  │ 🍽️ Demi-Pension                                   │        │
│  │ 🍽️🍽️ Pension Complète                            │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  📋 LOGISTIQUE                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Background: Purple/Pink gradient                               │
│  Border: Purple                                                 │
│                                                                 │
│  Besoin d'un Visa ? *                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │  ⚪ Oui             │  │  ⚪ Non             │             │
│  │                     │  │                     │             │
│  │  [Professional      │  │  [Professional      │             │
│  │   Toggle Style]     │  │   Toggle Style]     │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│  Vol Inclus ? *                                                │
│  ┌─────────────────────┐  ┌─────────────────────┐             │
│  │  ✈️ Avec Vol        │  │  ✈️ Sans Vol        │             │
│  │                     │  │                     │             │
│  │  [Icon + Text       │  │  [Icon + Text       │             │
│  │   Toggle]           │  │   Toggle]           │             │
│  └─────────────────────┘  └─────────────────────┘             │
│                                                                 │
│  [Animated entrance with staggered delays]                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  📅 DATES DE VOYAGE                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Background: Green/Teal gradient                                │
│  Border: Green                                                  │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ Date de Départ *     │  │ Date de Retour *     │           │
│  │ [📅 2026-06-15]      │  │ [📅 2026-06-30]      │           │
│  │                      │  │                      │           │
│  │ Min: Today           │  │ Min: Departure Date  │           │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                 │
│  ✅ Validation: Return must be after Departure                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Toggle Button States

### Visa Toggle (Professional Style)

```
UNSELECTED STATE:
┌─────────────────────┐
│  ⚪ Oui             │
│                     │
│  Border: Gray-200   │
│  Background: White  │
│  Text: Navy Blue    │
└─────────────────────┘

SELECTED STATE:
┌─────────────────────┐
│  🟢 Oui             │
│                     │
│  Border: Sage Green │
│  Background: Green  │
│  Text: Navy Blue    │
│  Shadow: Medium     │
└─────────────────────┘

HOVER STATE:
┌─────────────────────┐
│  ⚪ Oui             │
│                     │
│  Border: Sage/50%   │
│  Background: White  │
│  Cursor: Pointer    │
└─────────────────────┘
```

### Flight Toggle (Icon Style)

```
UNSELECTED STATE:
┌─────────────────────┐
│  ✈️ Avec Vol        │
│  (Gray icon)        │
│                     │
│  Border: Gray-200   │
│  Background: White  │
└─────────────────────┘

SELECTED STATE:
┌─────────────────────┐
│  ✈️ Avec Vol        │
│  (Sage Green icon)  │
│                     │
│  Border: Sage Green │
│  Background: Green  │
│  Shadow: Medium     │
└─────────────────────┘
```

---

## Conditional Rendering Flow

### Children Ages Field

```
INITIAL STATE (Children Count = 0):
┌─────────────────────────────────────┐
│ Nombre d'Adultes: [4]              │
│ Nombre d'Enfants: [0]              │
│                                     │
│ [Ages field is HIDDEN]              │
└─────────────────────────────────────┘

USER CHANGES TO 2 CHILDREN:
┌─────────────────────────────────────┐
│ Nombre d'Adultes: [4]              │
│ Nombre d'Enfants: [2]              │
│                                     │
│ ⬇️ [Animated entrance]              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Âge des Enfants *               │ │
│ │ [5 ans, 8 ans]                  │ │
│ │ 💡 Séparez les âges par virgules│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

Animation:
- Opacity: 0 → 1
- Height: 0 → auto
- Duration: 0.3s
- Easing: ease-in-out
```

---

## Color Palette by Section

```
┌─────────────────────────────────────────────────────────┐
│  SECTION COLOR GUIDE                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│  🏨 Hotel Configuration                                 │
│     Background: from-[#0a2357]/5 to-[#2C5F2D]/5        │
│     Border: border-[#2C5F2D]/20                        │
│     Icon: text-[#2C5F2D]                               │
│                                                         │
│  👥 Passenger Management                                │
│     Background: from-blue-50 to-indigo-50              │
│     Border: border-blue-200                            │
│     Icon: text-[#2C5F2D]                               │
│                                                         │
│  🍽️ Meal Plan                                           │
│     Background: from-amber-50 to-orange-50             │
│     Border: border-amber-200                           │
│     Icon: text-[#2C5F2D]                               │
│                                                         │
│  📋 Logistics                                           │
│     Background: from-purple-50 to-pink-50              │
│     Border: border-purple-200                          │
│     Icon: text-[#2C5F2D]                               │
│                                                         │
│  📅 Travel Dates                                        │
│     Background: from-green-50 to-teal-50               │
│     Border: border-green-200                           │
│     Icon: text-[#2C5F2D]                               │
└─────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Mobile (< 768px)

```
┌─────────────┐
│ 🏨 Hotel    │
│ ━━━━━━━━━━ │
│             │
│ [Type]      │
│ [Distance]  │
│ [Room Type] │
│ [Count]     │
│             │
│ 👥 Passagers│
│ ━━━━━━━━━━ │
│             │
│ [Adults]    │
│ [Children]  │
│ [Ages]      │
│             │
│ 🍽️ Pension  │
│ ━━━━━━━━━━ │
│             │
│ [Meal Plan] │
│             │
│ 📋 Logistic │
│ ━━━━━━━━━━ │
│             │
│ [Visa]      │
│ [Flight]    │
│             │
│ 📅 Dates    │
│ ━━━━━━━━━━ │
│             │
│ [Departure] │
│ [Return]    │
└─────────────┘

Single column
Full width fields
Stacked layout
```

### Tablet (768px - 1024px)

```
┌───────────────────────────┐
│ 🏨 Hotel Configuration    │
│ ━━━━━━━━━━━━━━━━━━━━━━━ │
│                           │
│ [Type]  [Distance]  [Room]│
│ [Count - Full Width]      │
│                           │
│ 👥 Passenger Management   │
│ ━━━━━━━━━━━━━━━━━━━━━━━ │
│                           │
│ [Adults]      [Children]  │
│ [Ages - Full Width]       │
│                           │
│ 🍽️ Meal Plan              │
│ ━━━━━━━━━━━━━━━━━━━━━━━ │
│                           │
│ [Meal Plan - Full Width]  │
│                           │
│ 📋 Logistics              │
│ ━━━━━━━━━━━━━━━━━━━━━━━ │
│                           │
│ [Visa - Full Width]       │
│ [Flight - Full Width]     │
│                           │
│ 📅 Travel Dates           │
│ ━━━━━━━━━━━━━━━━━━━━━━━ │
│                           │
│ [Departure]    [Return]   │
└───────────────────────────┘

2-column grid for pairs
Full width for singles
Comfortable spacing
```

### Desktop (> 1024px)

```
┌─────────────────────────────────────────────┐
│ 🏨 Hotel Configuration                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ [Type]      [Distance]      [Room Type]    │
│ [Count - Optimal Width]                     │
│                                             │
│ 👥 Passenger Management                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ [Adults Count]          [Children Count]    │
│ [Ages - Full Width if visible]              │
│                                             │
│ 🍽️ Meal Plan                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ [Meal Plan - Optimal Width]                 │
│                                             │
│ 📋 Logistics                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ Visa:   [Oui]  [Non]                        │
│ Flight: [Avec] [Sans]                       │
│                                             │
│ 📅 Travel Dates                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                             │
│ [Departure Date]        [Return Date]       │
└─────────────────────────────────────────────┘

3-column grid for hotel
2-column grid for pairs
Optimal spacing
Maximum readability
```

---

## Animation Timeline

```
User Action                    Animation                Duration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Select "Omrah"              → Section fade + expand    0.4s
Enter children count > 0    → Ages field appears       0.3s
Toggle Visa (first)         → Fade in                  0.1s delay
Toggle Flight (second)      → Fade in                  0.2s delay
Hover toggle button         → Border color change      instant
Click toggle button         → Background + shadow      instant
Select date                 → Calendar opens           instant
Submit form                 → Loading spinner          1.5s
Success                     → Checkmark + message      0.3s
```

---

## Error State Visualization

```
FIELD WITH ERROR:
┌────────────────────────────────────┐
│ Nombre d'Adultes *                 │
│ [    ]  (Empty field)              │
│ ❌ Nombre d'adultes requis.        │
│    (Red text, animated entrance)   │
└────────────────────────────────────┘

FIELD VALID:
┌────────────────────────────────────┐
│ Nombre d'Adultes *                 │
│ [  4  ]  (Filled field)            │
│ ✅ (No error message)              │
└────────────────────────────────────┘

DATE VALIDATION ERROR:
┌────────────────────────────────────┐
│ Date de Retour *                   │
│ [📅 2026-06-10]                    │
│ ❌ La date de retour doit être     │
│    après la date de départ.        │
└────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Input
    ↓
FormData State (React useState)
    ↓
Validation (on submit)
    ↓
    ├─→ [Errors] → Display error messages
    │                     ↓
    │              User corrects
    │                     ↓
    │              Retry submit
    │
    └─→ [Valid] → Check login status
                        ↓
                        ├─→ [Not logged in] → Show login modal
                        │                           ↓
                        │                    User logs in
                        │                           ↓
                        │                    Auto-submit
                        │
                        └─→ [Logged in] → Submit to backend
                                                ↓
                                         Save to localStorage
                                                ↓
                                         Save to DataContext
                                                ↓
                                         Show success message
                                                ↓
                                         Reset form
```

---

## Field Dependencies

```
┌─────────────────────────────────────────────────────────┐
│  FIELD DEPENDENCY TREE                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│  Nombre d'Enfants                                       │
│         ↓                                               │
│         ├─→ [= 0] → Âge des Enfants: HIDDEN            │
│         └─→ [> 0] → Âge des Enfants: VISIBLE + REQUIRED│
│                                                         │
│  Date de Départ                                         │
│         ↓                                               │
│         └─→ Sets minimum for Date de Retour            │
│                                                         │
│  Date de Retour                                         │
│         ↓                                               │
│         └─→ Must be > Date de Départ                   │
└─────────────────────────────────────────────────────────┘
```

---

## Success State

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                         ✅                              │
│                    (Large Icon)                         │
│                    (64px size)                          │
│                                                         │
│                  DEMANDE ENVOYÉE !                      │
│                  (Bold, 2xl, Navy)                      │
│                                                         │
│         Notre équipe vous répondra dans les             │
│              plus brefs délais.                         │
│         (Muted foreground, centered)                    │
│                                                         │
│         [Animated fade-in + scale effect]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Visual design philosophy**: Clean, organized, color-coded sections with smooth animations and professional toggle switches for an excellent user experience! 🎨

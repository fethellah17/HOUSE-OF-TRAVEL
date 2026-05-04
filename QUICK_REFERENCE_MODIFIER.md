# Quick Reference - Profile Modifier Button

## 🚀 Quick Start

### To Add Modifier Button to Any Form:

```typescript
// 1. Import dependencies
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import LoginModal from "@/components/LoginModal";

// 2. Add state
const [showLoginModal, setShowLoginModal] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

// 3. Add event listener for updates
useEffect(() => {
  const loadUserData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      setIsLoggedIn(true);
      // Update form fields
    }
  };
  
  loadUserData();
  window.addEventListener("profileUpdated", loadUserData);
  
  return () => {
    window.removeEventListener("profileUpdated", loadUserData);
  };
}, []);

// 4. Add button to header
<div className="flex justify-between">
  <h2>Informations Personnelles</h2>
  {isLoggedIn && (
    <button onClick={() => setShowLoginModal(true)}>
      <Pencil size={14} />
      <span>Modifier</span>
    </button>
  )}
</div>

// 5. Add LoginModal
<LoginModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
  editMode={true}
/>
```

---

## 📋 Component API

### LoginModal Props

```typescript
interface LoginModalProps {
  isOpen: boolean;           // Controls modal visibility
  onClose: () => void;       // Called when modal closes
  onLoginSuccess?: (user: User) => void;  // Optional callback
  editMode?: boolean;        // NEW: Opens in edit mode
}
```

### Usage Examples

```typescript
// Regular login/register
<LoginModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>

// Profile editing
<LoginModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  editMode={true}
/>
```

---

## 🎨 Styling Classes

### Modifier Button

```typescript
<button
  onClick={() => setShowLoginModal(true)}
  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 touch-manipulation"
  type="button"
>
  <Pencil size={14} />
  <span>Modifier</span>
</button>
```

### Header Layout (Responsive)

```typescript
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-2 border-b border-gray-200">
  <h2 className="text-xl font-semibold text-primary">
    Informations Personnelles
  </h2>
  {isLoggedIn && (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-normal text-green-600">
        ✓ Pré-remplies depuis votre profil
      </span>
      {/* Modifier button here */}
    </div>
  )}
</div>
```

---

## 🔄 Event System

### Dispatching Updates (in LoginModal)

```typescript
// After saving profile changes
localStorage.setItem("currentUser", JSON.stringify(updatedUser));
window.dispatchEvent(new Event("profileUpdated"));
```

### Listening for Updates (in Forms)

```typescript
useEffect(() => {
  const handleProfileUpdate = () => {
    // Reload user data
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setForm(prev => ({
      ...prev,
      nom: currentUser.nom,
      prenom: currentUser.prenom,
      email: currentUser.email,
      telephone: currentUser.phone,
    }));
  };
  
  window.addEventListener("profileUpdated", handleProfileUpdate);
  
  return () => {
    window.removeEventListener("profileUpdated", handleProfileUpdate);
  };
}, []);
```

---

## 💾 localStorage Structure

### currentUser Object

```typescript
interface CurrentUser {
  id: string;
  nom: string;
  prenom: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Example
{
  "id": "user-1234567890",
  "nom": "Benali",
  "prenom": "Ahmed",
  "fullName": "Ahmed Benali",
  "email": "ahmed@example.com",
  "phone": "0600000000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### users Array

```typescript
// Array of all registered users
[
  {
    id: "user-1234567890",
    fullName: "Ahmed Benali",
    email: "ahmed@example.com",
    phone: "0600000000",
    password: "hashed_password",
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  // ... more users
]
```

---

## ✅ Validation Rules

### In LoginModal (handleUpdateProfile)

```typescript
const validateStep1 = () => {
  const newErrors: Record<string, string> = {};
  
  if (!nom.trim()) {
    newErrors.nom = "Le nom est requis";
  }
  
  if (!prenom.trim()) {
    newErrors.prenom = "Le prénom est requis";
  }
  
  if (!email.trim()) {
    newErrors.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Email invalide";
  }
  
  if (!phone.trim()) {
    newErrors.phone = "Le téléphone est requis";
  } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ""))) {
    newErrors.phone = "Numéro invalide (10 chiffres requis)";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 🎯 Common Patterns

### Pattern 1: Auto-Fill with Edit Capability

```typescript
const MyForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  
  useEffect(() => {
    const loadUserData = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setIsLoggedIn(true);
        setForm(prev => ({
          ...prev,
          nom: currentUser.nom,
          prenom: currentUser.prenom,
          email: currentUser.email,
          telephone: currentUser.phone,
        }));
      }
    };
    
    loadUserData();
    window.addEventListener("profileUpdated", loadUserData);
    
    return () => {
      window.removeEventListener("profileUpdated", loadUserData);
    };
  }, []);
  
  return (
    <>
      <form>
        <div className="flex justify-between">
          <h2>Informations Personnelles</h2>
          {isLoggedIn && (
            <button onClick={() => setShowLoginModal(true)}>
              <Pencil size={14} />
              Modifier
            </button>
          )}
        </div>
        
        <input value={form.nom} readOnly={isLoggedIn} />
        <input value={form.prenom} readOnly={isLoggedIn} />
        <input value={form.email} readOnly={isLoggedIn} />
        <input value={form.telephone} readOnly={isLoggedIn} />
      </form>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        editMode={true}
      />
    </>
  );
};
```

### Pattern 2: Conditional Styling

```typescript
<input
  type="text"
  value={form.nom}
  readOnly={isLoggedIn}
  className={`devis-input ${
    isLoggedIn 
      ? "bg-blue-50 border-primary/30 cursor-not-allowed" 
      : ""
  }`}
  title={isLoggedIn ? "Ce champ est pré-rempli depuis votre profil" : ""}
/>
```

### Pattern 3: Toast Notifications

```typescript
import { toast } from "sonner";

// On successful update
toast.success("Profil mis à jour avec succès !");

// On error
toast.error("Erreur lors de la mise à jour");

// On auto-fill
toast.success("Vos informations ont été pré-remplies !", {
  duration: 3000,
});
```

---

## 🐛 Troubleshooting

### Issue: Modal doesn't open in edit mode

**Solution:**
```typescript
// Make sure editMode prop is set to true
<LoginModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
  editMode={true}  // ← Must be true
/>
```

### Issue: Form doesn't update after save

**Solution:**
```typescript
// Make sure event listener is properly set up
useEffect(() => {
  const handleProfileUpdate = () => {
    loadUserData();
  };
  
  window.addEventListener("profileUpdated", handleProfileUpdate);
  
  // Don't forget cleanup!
  return () => {
    window.removeEventListener("profileUpdated", handleProfileUpdate);
  };
}, []);
```

### Issue: Button not visible on mobile

**Solution:**
```typescript
// Use responsive classes
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
  <h2>Title</h2>
  {isLoggedIn && (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Button here */}
    </div>
  )}
</div>
```

### Issue: localStorage not updating

**Solution:**
```typescript
// Update both currentUser and users array
const updatedUser = { ...currentUser, nom, prenom, email, phone };

// Update currentUser
localStorage.setItem("currentUser", JSON.stringify(updatedUser));

// Update users array
const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
const userIndex = existingUsers.findIndex(u => u.id === currentUser.id);
if (userIndex !== -1) {
  existingUsers[userIndex] = { ...existingUsers[userIndex], nom, prenom, email, phone };
  localStorage.setItem("users", JSON.stringify(existingUsers));
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.header {
  flex-direction: column;
}

/* Tablet and up (≥640px) */
@media (min-width: 640px) {
  .header {
    flex-direction: row;
  }
}

/* Desktop (≥768px) */
@media (min-width: 768px) {
  .button {
    padding: 0.375rem 0.75rem;
  }
}
```

---

## 🎨 Color Variables

```css
/* Navy Blue (Primary) */
--primary: 210 100% 25%;  /* #0a2357 */

/* Sage Green (Success) */
--success: #2C5F2D;

/* Light Blue (Auto-fill) */
--auto-fill-bg: rgb(239 246 255);  /* bg-blue-50 */
--auto-fill-border: rgba(10, 35, 87, 0.3);  /* border-primary/30 */
```

---

## 🔍 Testing Checklist

```typescript
// Manual Testing
[ ] Button appears when logged in
[ ] Button hidden when logged out
[ ] Modal opens on click
[ ] Modal shows edit view
[ ] Fields are pre-filled
[ ] Validation works
[ ] Save updates localStorage
[ ] Event dispatches
[ ] Forms update automatically
[ ] Toast appears
[ ] Mobile responsive
[ ] Desktop responsive

// Code Testing
[ ] No TypeScript errors
[ ] No console errors
[ ] Event listeners cleaned up
[ ] No memory leaks
[ ] Build succeeds
```

---

## 📚 Related Files

```
src/
├── components/
│   ├── LoginModal.tsx       ← Edit profile view
│   └── DevisForm.tsx        ← Modifier button implementation
├── pages/
│   └── BilletteriePage.tsx  ← Modifier button implementation
└── types.ts                 ← User interface definitions
```

---

## 🚀 Quick Commands

```bash
# Build project
npm run build

# Check TypeScript
npm run type-check

# Run dev server
npm run dev

# Check diagnostics
# (Use getDiagnostics tool in Kiro)
```

---

## 💡 Pro Tips

1. **Always clean up event listeners** to prevent memory leaks
2. **Use toast notifications** for user feedback
3. **Validate before saving** to ensure data integrity
4. **Test on mobile** to ensure touch targets are adequate
5. **Keep branding consistent** with Navy Blue theme
6. **Use Framer Motion** for smooth animations
7. **Handle errors gracefully** with try-catch blocks
8. **Document your code** for future maintainers

---

## 📞 Need Help?

Check these documents:
- `PROFILE_EDIT_FEATURE.md` - Technical details
- `MODIFIER_BUTTON_GUIDE.md` - Visual guide
- `BEFORE_AFTER_COMPARISON.md` - Feature comparison
- `IMPLEMENTATION_COMPLETE_MODIFIER.md` - Full summary

---

**Happy Coding! 🎉**

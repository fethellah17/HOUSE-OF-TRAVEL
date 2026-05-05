# 🧪 Devis Form - Testing Guide

## Quick Start Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Devis Page
Open your browser and go to:
```
http://localhost:5173/devis
```

## 🎯 Test Scenarios

### Scenario 1: Omrah Booking (Happy Path)

**Steps:**
1. ✅ Fill personal info (or login to auto-fill)
2. ✅ Click "Voyage Organisé / Omrah" card
3. ✅ Click "Omrah" option
4. ✅ Select "⭐⭐⭐⭐⭐ 5 Étoiles"
5. ✅ Select "🕌 Proche (0-500m)"
6. ✅ Select "🛏️🛏️ Triple"
7. ✅ Add optional message
8. ✅ Click "Confirmer ma Réservation"

**Expected Result:**
- ✅ Form validates successfully
- ✅ Login modal appears (if not logged in)
- ✅ After login, form submits
- ✅ Success message displays
- ✅ Data saved to admin inbox

---

### Scenario 2: Voyage Organisé (Happy Path)

**Steps:**
1. ✅ Fill personal info
2. ✅ Click "Voyage Organisé / Omrah" card
3. ✅ Click "Voyage Organisé" option
4. ✅ Select destination: "🇹🇷 Turquie"
5. ✅ Select "🍽️ Pension Complète"
6. ✅ Add optional message
7. ✅ Click "Confirmer ma Réservation"

**Expected Result:**
- ✅ Form validates successfully
- ✅ Submission works
- ✅ Success message displays

---

### Scenario 3: Visa Assistant - Schengen (Happy Path)

**Steps:**
1. ✅ Fill personal info
2. ✅ Click "Assistant Visa" card
3. ✅ Select profession: "💼 Salarié"
4. ✅ Select destination: "🇪🇺 Espace Schengen"
5. ✅ Verify document checklist appears (should show ~10 documents)
6. ✅ Add optional message
7. ✅ Click "Confirmer ma Réservation"

**Expected Documents for Salarié + Schengen:**
- Passeport valide (6 mois minimum)
- Photos d'identité récentes
- Formulaire de demande de visa
- Assurance voyage (30 000€ minimum)
- Réservation d'hôtel ou lettre d'invitation
- Relevés bancaires (3 derniers mois)
- Attestation de travail
- Fiches de paie (3 derniers mois)
- Autorisation de congé

---

### Scenario 4: Visa Assistant - Canada WITHOUT USA Visa

**Steps:**
1. ✅ Fill personal info
2. ✅ Click "Assistant Visa" card
3. ✅ Select profession: "🏪 Commerçant"
4. ✅ Select destination: "🇨🇦 Canada"
5. ✅ Click "❌ Non, je n'en ai pas" (for USA Visa question)
6. ✅ Verify document checklist appears
7. ✅ Click "Confirmer ma Réservation"

**Expected Result:**
- ✅ No magic alert appears
- ✅ Standard document checklist shows
- ✅ Form submits normally

---

### Scenario 5: Visa Assistant - Canada WITH USA Visa (THE MAGIC! 🎉)

**Steps:**
1. ✅ Fill personal info
2. ✅ Click "Assistant Visa" card
3. ✅ Select profession: "⚖️ Profession Libérale"
4. ✅ Select destination: "🇨🇦 Canada"
5. ✅ Click "✅ Oui, j'ai un Visa USA"
6. ✅ **WATCH THE MAGIC HAPPEN!**

**Expected Result:**
- 🎉 Green celebration alert appears
- 🎉 Animated rotating checkmark
- 🎉 Message: "Félicitations! Vous êtes éligible au Simplified Path"
- ✅ Document checklist still appears below
- ✅ Form submits normally

---

### Scenario 6: Validation Errors

**Steps:**
1. ❌ Leave all fields empty
2. ❌ Click "Confirmer ma Réservation" (without selecting service path)

**Expected Result:**
- ❌ Error toast appears: "Veuillez remplir tous les champs obligatoires"
- ❌ Error messages appear under empty required fields
- ❌ Form does not submit

**Then:**
3. ✅ Fill personal info
4. ✅ Select "Voyage Organisé / Omrah"
5. ✅ Select "Omrah"
6. ❌ Leave hotel type empty
7. ❌ Click "Confirmer ma Réservation"

**Expected Result:**
- ❌ Error appears: "Type d'hôtel requis"
- ❌ Form does not submit

---

### Scenario 7: Login Flow

**Steps:**
1. ✅ Fill personal info manually
2. ✅ Complete form (any path)
3. ✅ Click "Confirmer ma Réservation"
4. ✅ Login modal appears
5. ✅ Login or create account
6. ✅ Modal closes

**Expected Result:**
- ✅ Personal info fields update with user data
- ✅ Form auto-submits after login
- ✅ Success message displays

---

### Scenario 8: Responsive Design

**Test on Different Devices:**

**Mobile (< 768px):**
- ✅ Single column layout
- ✅ Touch-optimized buttons
- ✅ Readable text size
- ✅ No horizontal scroll

**Tablet (768px - 1024px):**
- ✅ Two column grid for fields
- ✅ Comfortable spacing
- ✅ Good button sizes

**Desktop (> 1024px):**
- ✅ Optimal spacing
- ✅ Max-width container
- ✅ Beautiful layout

---

### Scenario 9: Animation Testing

**Watch for:**
- ✅ Smooth fade-in on page load
- ✅ Scale effect on button hover
- ✅ Smooth transitions between paths
- ✅ Height expand animations
- ✅ Staggered document list appearance
- ✅ Spring bounce on Canada magic alert
- ✅ Rotating checkmark animation

---

### Scenario 10: Edge Cases

**Test 1: Switch Between Paths**
1. ✅ Select "Voyage Organisé / Omrah"
2. ✅ Fill Omrah details
3. ✅ Switch to "Assistant Visa"
4. ✅ Verify Omrah data is cleared
5. ✅ Fill Visa details
6. ✅ Switch back to "Voyage Organisé / Omrah"
7. ✅ Verify Visa data is cleared

**Test 2: Switch Between Travel Types**
1. ✅ Select "Voyage Organisé / Omrah"
2. ✅ Select "Omrah"
3. ✅ Fill Omrah details
4. ✅ Switch to "Voyage Organisé"
5. ✅ Verify Omrah data is cleared
6. ✅ Fill Voyage details

**Test 3: Long Message**
1. ✅ Type 1000 characters in message field
2. ✅ Verify it accepts all characters
3. ✅ Try to type more
4. ✅ Verify it stops at 1000 (maxLength)

---

## 🔍 Visual Inspection Checklist

### Colors
- ✅ Navy Blue (#0a2357) used for headers and text
- ✅ Sage Green (#2C5F2D) used for CTA button and accents
- ✅ Consistent color usage throughout

### Typography
- ✅ Headers use Fraunces font
- ✅ Body text uses Sora font
- ✅ Font sizes are readable
- ✅ Line heights are comfortable

### Spacing
- ✅ Consistent padding/margins
- ✅ No elements touching edges
- ✅ Good whitespace balance
- ✅ Sections clearly separated

### Borders & Shadows
- ✅ Rounded corners (rounded-xl, rounded-2xl)
- ✅ Subtle shadows (shadow-xl)
- ✅ Border-l-4 on section headers
- ✅ Consistent border colors

### Interactive Elements
- ✅ Hover effects work
- ✅ Focus states visible
- ✅ Click feedback (scale down)
- ✅ Cursor changes appropriately

---

## 🐛 Bug Testing

### Common Issues to Check

**Issue 1: Form doesn't submit**
- ✅ Check console for errors
- ✅ Verify all required fields filled
- ✅ Check if user is logged in
- ✅ Verify validation passes

**Issue 2: Animations not working**
- ✅ Check if Framer Motion is installed
- ✅ Verify AnimatePresence is used correctly
- ✅ Check browser compatibility

**Issue 3: Styles not applied**
- ✅ Verify Tailwind CSS is working
- ✅ Check if premium-input class exists in CSS
- ✅ Clear browser cache

**Issue 4: Login modal doesn't appear**
- ✅ Check if LoginModal component exists
- ✅ Verify showLoginModal state
- ✅ Check console for errors

---

## 📊 Performance Testing

### Load Time
- ✅ Page loads in < 2 seconds
- ✅ No layout shift
- ✅ Smooth initial render

### Interaction Speed
- ✅ Button clicks respond instantly
- ✅ Animations don't lag
- ✅ Form submission is fast

### Memory Usage
- ✅ No memory leaks
- ✅ Smooth scrolling
- ✅ No console warnings

---

## ✅ Acceptance Criteria

### Functionality
- ✅ All form paths work correctly
- ✅ Validation works as expected
- ✅ Login integration works
- ✅ Data saves correctly
- ✅ Success message displays

### Design
- ✅ Matches design specifications
- ✅ Colors are correct
- ✅ Typography is consistent
- ✅ Spacing is appropriate
- ✅ Responsive on all devices

### UX
- ✅ Intuitive to use
- ✅ Clear feedback
- ✅ No confusing elements
- ✅ Error messages are helpful
- ✅ Smooth animations

### Code Quality
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ Clean code structure
- ✅ Well documented
- ✅ Maintainable

---

## 🎯 Test Results Template

```
Test Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

Scenario 1 (Omrah):           ✅ / ❌
Scenario 2 (Voyage):          ✅ / ❌
Scenario 3 (Visa Schengen):   ✅ / ❌
Scenario 4 (Canada No USA):   ✅ / ❌
Scenario 5 (Canada Magic):    ✅ / ❌
Scenario 6 (Validation):      ✅ / ❌
Scenario 7 (Login):           ✅ / ❌
Scenario 8 (Responsive):      ✅ / ❌
Scenario 9 (Animations):      ✅ / ❌
Scenario 10 (Edge Cases):     ✅ / ❌

Visual Inspection:            ✅ / ❌
Performance:                  ✅ / ❌
Code Quality:                 ✅ / ❌

Overall Status:               ✅ PASS / ❌ FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Production Readiness Checklist

Before deploying to production:

- ✅ All test scenarios pass
- ✅ No console errors
- ✅ No TypeScript errors
- ✅ Build succeeds (`npm run build`)
- ✅ Tested on Chrome, Firefox, Safari
- ✅ Tested on mobile devices
- ✅ Tested on tablet devices
- ✅ Performance is acceptable
- ✅ Accessibility checked
- ✅ SEO considerations addressed
- ✅ Analytics tracking ready (if needed)
- ✅ Error tracking ready (if needed)
- ✅ Backup of old form (if needed)
- ✅ Rollback plan ready

---

## 📞 Support

If you find any issues during testing:

1. Check the console for errors
2. Review the documentation
3. Verify your test steps
4. Check browser compatibility
5. Clear cache and try again

---

**Happy Testing! 🎉**

Remember: The Canada Magic feature is the star of the show - make sure to test it thoroughly! 🇨🇦✨

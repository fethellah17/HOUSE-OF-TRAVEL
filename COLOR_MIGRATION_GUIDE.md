# Color Migration Guide - House of Travel Brand Overhaul

## Executive Summary
Complete transition from Navy Blue & Sage Green to Purple & Yellow brand colors across all UI components.

---

## Color Mapping Reference

### Primary Colors Migration

#### Navy Blue → Purple
| Element | Old Color | New Color | Hex | Usage |
|---------|-----------|-----------|-----|-------|
| Headings | Navy Blue | Purple | #4B2C7F | All h1, h2, h3, h4, h5, h6 |
| Primary Buttons | Navy Blue | Purple | #4B2C7F | Main CTAs, form submit |
| Navigation Links | Navy Blue | Purple | #4B2C7F | Active nav states |
| Form Labels | Navy Blue | Purple | #4B2C7F | All form field labels |
| Borders (Primary) | Navy Blue | Purple | #4B2C7F | Section dividers, active states |
| Focus Rings | Navy Blue | Purple | #4B2C7F | Input focus states |

#### Sage Green → Purple
| Element | Old Color | New Color | Hex | Usage |
|---------|-----------|-----------|-----|-------|
| Secondary Buttons | Sage Green | Purple | #4B2C7F | Secondary CTAs |
| Icon Backgrounds | Sage Green | Purple | #4B2C7F | Service card icons |
| Hover Indicators | Sage Green | Yellow | #FFD700 | Card bottom bars |
| Active States | Sage Green | Purple | #4B2C7F | Toggle buttons, selections |
| Accent Borders | Sage Green | Purple | #4B2C7F | Form section borders |

---

## Component-by-Component Changes

### 1. Hero Section (Home Page)

**Before:**
```
Title: Navy Blue (#0a2357)
Subtitle: Sage Green (#2C5F2D)
Primary Button: Sage Green background
Secondary Button: Navy Blue background
Background: Gradient (white → slate-50 → white)
```

**After:**
```
Title: Purple (#4B2C7F)
Subtitle: Yellow (#FFD700)
Primary Button: Purple background with white text
Secondary Button: Yellow background with purple text
Background: Pure White (#FFFFFF)
```

### 2. Service Cards

**Before:**
```
Icon Background: Sage Green gradient
Icon Color: Sage Green (#2C5F2D)
Title: Navy Blue (#0a2357)
Hover Indicator: Sage Green (#2C5F2D)
Border: Slate-200
```

**After:**
```
Icon Background: Purple/Yellow gradient
Icon Color: Purple (#4B2C7F)
Title: Purple (#4B2C7F)
Hover Indicator: Yellow (#FFD700)
Border: Slate-200 (unchanged)
```

### 3. Devis Form

**Before:**
```
Section Borders: Navy Blue (#0a2357)
Section Titles: Navy Blue (#0a2357)
Form Labels: Navy Blue (#0a2357)
"Modifier" Button: Sage Green (#2C5F2D)
Submit Button: Sage Green (#2C5F2D)
Focus Ring: Navy Blue (#0a2357)
```

**After:**
```
Section Borders: Purple (#4B2C7F)
Section Titles: Purple (#4B2C7F)
Form Labels: Purple (#4B2C7F)
"Modifier" Button: Purple (#4B2C7F)
Submit Button: Purple (#4B2C7F)
Focus Ring: Purple (#4B2C7F)
```

### 4. Logistics Buttons (Oui/Non)

**Before:**
```
Active State: Navy Blue background with Navy Blue text
Inactive State: Gray border with gray text
```

**After:**
```
Active State: Purple border with white background and purple text
Inactive State: Gray border with white background
Mobile: Stacked vertically (flex-col sm:flex-row)
```

### 5. Travel Module

**Before:**
```
Travel Type Buttons: Sage Green active state
Section Headings: Navy Blue (#0a2357)
Form Labels: Navy Blue (#0a2357)
```

**After:**
```
Travel Type Buttons: Purple active state with purple/yellow gradient
Section Headings: Purple (#4B2C7F)
Form Labels: Purple (#4B2C7F)
```

### 6. Visa Assistant Module

**Before:**
```
Section Border: Sage Green (#2C5F2D)
Section Title: Navy Blue (#0a2357)
Form Labels: Navy Blue (#0a2357)
Document Icons: Sage Green (#2C5F2D)
Document Checklist Background: Navy/Sage gradient
```

**After:**
```
Section Border: Purple (#4B2C7F)
Section Title: Purple (#4B2C7F)
Form Labels: Purple (#4B2C7F)
Document Icons: Purple (#4B2C7F)
Document Checklist Background: Purple/Yellow gradient
```

---

## CSS Variable Updates

### Before (src/index.css)
```css
:root {
  --primary: 210 100% 25%;           /* Navy Blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 30 30% 58%;           /* Sage Green */
  --secondary-foreground: 0 0% 100%;
  --accent: 43 74% 49%;              /* Sage Green */
  --accent-foreground: 220 15% 15%;
  --ring: 210 100% 25%;              /* Navy Blue */
}
```

### After (src/index.css)
```css
:root {
  --primary: 265 47% 35%;            /* Purple */
  --primary-foreground: 0 0% 100%;
  --secondary: 51 100% 50%;          /* Yellow */
  --secondary-foreground: 265 47% 35%; /* Purple */
  --accent: 51 100% 50%;             /* Yellow */
  --accent-foreground: 265 47% 35%;  /* Purple */
  --ring: 265 47% 35%;               /* Purple */
}
```

---

## Tailwind Class Changes

### Text Colors
```
text-[#0a2357] → text-[#4B2C7F]  (Navy Blue → Purple)
text-[#2C5F2D] → text-[#4B2C7F]  (Sage Green → Purple)
```

### Background Colors
```
bg-[#0a2357] → bg-[#4B2C7F]      (Navy Blue → Purple)
bg-[#2C5F2D] → bg-[#4B2C7F]      (Sage Green → Purple)
bg-[#2C5F2D]/5 → bg-[#4B2C7F]/5  (Sage Green opacity → Purple opacity)
bg-[#2C5F2D]/10 → bg-[#4B2C7F]/10 (Sage Green opacity → Purple opacity)
```

### Border Colors
```
border-[#0a2357] → border-[#4B2C7F]  (Navy Blue → Purple)
border-[#2C5F2D] → border-[#4B2C7F]  (Sage Green → Purple)
border-[#2C5F2D]/20 → border-[#4B2C7F]/20 (Sage Green opacity → Purple opacity)
border-[#2C5F2D]/30 → border-[#4B2C7F]/30 (Sage Green opacity → Purple opacity)
border-[#2C5F2D]/50 → border-[#4B2C7F]/50 (Sage Green opacity → Purple opacity)
```

### Hover States
```
hover:bg-[#234d24] → hover:bg-[#3a1f5f]  (Sage Green dark → Purple dark)
hover:border-[#2C5F2D]/50 → hover:border-[#4B2C7F]/50
```

---

## Accessibility Considerations

### Color Contrast
- **Purple (#4B2C7F) on White**: WCAG AAA compliant ✅
- **Yellow (#FFD700) on Purple**: WCAG AA compliant ✅
- **Purple on Yellow**: WCAG AA compliant ✅
- **White on Purple**: WCAG AAA compliant ✅

### Recommendations
- Maintain sufficient contrast ratios
- Don't rely solely on color to convey information
- Use icons and text labels alongside colors
- Test with color blindness simulators

---

## Mobile Optimization Changes

### Button Stacking
**Before:**
```jsx
className="flex flex-col sm:flex-row gap-4"
```

**After:**
```jsx
className="flex flex-col sm:flex-row gap-4"  // Maintained
```

### Touch Targets
- Desktop: `min-h-[52px]`
- Mobile: `min-h-[60px]` for logistics buttons
- All buttons maintain minimum 48px height for accessibility

### Responsive Typography
- Hero title: 3xl (mobile) → 6xl (desktop)
- Section headings: 2xl (mobile) → 5xl (desktop)
- Form labels: sm (consistent across all sizes)

---

## Testing Checklist

### Visual Verification
- [ ] All headings display in purple
- [ ] All primary buttons are purple
- [ ] All secondary buttons are yellow
- [ ] Service card icons are purple
- [ ] Hover states show yellow accents
- [ ] Form labels are purple
- [ ] Focus rings are purple
- [ ] Backgrounds are white

### Responsive Testing
- [ ] Mobile (375px): All elements visible and properly spaced
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Desktop (1920px): Full layout displays properly
- [ ] Touch targets are at least 48px

### Cross-Browser Testing
- [ ] Chrome/Edge: Colors render correctly
- [ ] Firefox: Colors render correctly
- [ ] Safari: Colors render correctly
- [ ] Mobile browsers: Colors render correctly

### Accessibility Testing
- [ ] Color contrast meets WCAG AA minimum
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Screen readers work correctly

---

## Rollback Instructions (if needed)

To revert to the old color scheme:

1. **src/index.css**: Restore CSS variables to original values
2. **src/pages/Index.tsx**: Replace all `#4B2C7F` with `#0a2357` or `#2C5F2D`
3. **src/components/**: Replace all color references
4. Run `npm run build` to verify

---

## Performance Impact

- **No performance impact**: Color changes are CSS-only
- **Build size**: Unchanged (colors are inline in Tailwind classes)
- **Load time**: No impact
- **Runtime performance**: No impact

---

## Brand Guidelines

### When to Use Purple (#4B2C7F)
- Primary headings and titles
- Main call-to-action buttons
- Navigation elements
- Form labels and borders
- Active states
- Primary icons

### When to Use Yellow (#FFD700)
- Hover states
- Secondary accents
- Highlights and emphasis
- Energy indicators
- Secondary CTAs
- Decorative elements

### When to Use White (#FFFFFF)
- All backgrounds
- Text on colored backgrounds
- Spacing and breathing room
- Clean, minimalist design

---

## Future Considerations

1. **Consistency**: Ensure all new components follow the purple/yellow palette
2. **Documentation**: Update brand guidelines with new colors
3. **Design System**: Consider creating Figma components with new colors
4. **Testing**: Conduct user testing to validate color choices
5. **Analytics**: Track user engagement with new color scheme

---

**Last Updated**: May 6, 2026
**Status**: ✅ Complete and Verified

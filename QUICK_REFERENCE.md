# House of Travel - Brand Colors Quick Reference

## 🎨 Official Brand Colors

### Primary Purple
```
Hex:     #4B2C7F
RGB:     rgb(75, 44, 127)
HSL:     hsl(265, 47%, 35%)
Tailwind: text-[#4B2C7F], bg-[#4B2C7F], border-[#4B2C7F]
```
**Usage**: Headings, primary buttons, navigation, form labels, borders

### Accent Yellow
```
Hex:     #FFD700
RGB:     rgb(255, 215, 0)
HSL:     hsl(51, 100%, 50%)
Tailwind: text-[#FFD700], bg-[#FFD700], border-[#FFD700]
```
**Usage**: Hover states, secondary accents, highlights, energy indicators

### Background White
```
Hex:     #FFFFFF
RGB:     rgb(255, 255, 255)
HSL:     hsl(0, 0%, 100%)
Tailwind: bg-white, text-white
```
**Usage**: All backgrounds, text on colored backgrounds

---

## 📋 Component Color Guide

### Headings
```
Color: Purple (#4B2C7F)
Example: <h1 className="text-[#4B2C7F]">Title</h1>
```

### Primary Buttons
```
Background: Purple (#4B2C7F)
Text: White (#FFFFFF)
Hover: Darker Purple (#3a1f5f)
Example: <button className="bg-[#4B2C7F] text-white hover:bg-[#3a1f5f]">
```

### Secondary Buttons
```
Background: Yellow (#FFD700)
Text: Purple (#4B2C7F)
Hover: Darker Yellow (#FFC700)
Example: <button className="bg-[#FFD700] text-[#4B2C7F] hover:bg-[#FFC700]">
```

### Form Labels
```
Color: Purple (#4B2C7F)
Example: <label className="text-[#4B2C7F]">Label</label>
```

### Form Inputs (Focus)
```
Border: Purple (#4B2C7F)
Ring: Purple with 10% opacity
Example: className="border-[#4B2C7F] ring-4 ring-[#4B2C7F]/10"
```

### Active States
```
Border: Purple (#4B2C7F)
Background: White (#FFFFFF)
Text: Purple (#4B2C7F)
Example: className="border-[#4B2C7F] bg-white text-[#4B2C7F]"
```

### Hover Indicators
```
Color: Yellow (#FFD700)
Example: className="bg-[#FFD700]"
```

---

## 🔄 Color Replacement Cheat Sheet

### Find & Replace
```
Old Navy Blue:    #0a2357  →  New Purple:  #4B2C7F
Old Sage Green:   #2C5F2D  →  New Purple:  #4B2C7F
New Accent:       (none)   →  New Yellow:  #FFD700
```

### Tailwind Classes
```
text-[#0a2357]     → text-[#4B2C7F]
text-[#2C5F2D]     → text-[#4B2C7F]
bg-[#0a2357]       → bg-[#4B2C7F]
bg-[#2C5F2D]       → bg-[#4B2C7F]
border-[#0a2357]   → border-[#4B2C7F]
border-[#2C5F2D]   → border-[#4B2C7F]
hover:bg-[#234d24] → hover:bg-[#3a1f5f]
```

---

## 📱 Mobile Optimization

### Button Heights
```
Desktop: min-h-[52px]
Mobile:  min-h-[60px]
```

### Button Stacking
```
Desktop: flex flex-row
Mobile:  flex flex-col sm:flex-row
```

### Touch Targets
```
Minimum: 48px × 48px
Recommended: 52px × 52px
```

---

## ✅ Verification Checklist

### Visual Elements
- [ ] All headings are purple
- [ ] All primary buttons are purple
- [ ] All secondary buttons are yellow
- [ ] All form labels are purple
- [ ] All focus rings are purple
- [ ] All hover states show yellow
- [ ] All backgrounds are white

### Responsive
- [ ] Mobile buttons stack vertically
- [ ] Touch targets are at least 48px
- [ ] Typography scales properly
- [ ] Spacing is consistent

### Accessibility
- [ ] Color contrast is WCAG AA+
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Screen readers work

---

## 🎯 Common Use Cases

### Hero Section
```jsx
<h1 className="text-[#4B2C7F]">Title</h1>
<span className="text-[#FFD700]">Accent</span>
<button className="bg-[#4B2C7F] text-white">Primary CTA</button>
<button className="bg-[#FFD700] text-[#4B2C7F]">Secondary CTA</button>
```

### Form Section
```jsx
<div className="border-l-4 border-[#4B2C7F]">
  <h2 className="text-[#4B2C7F]">Section Title</h2>
  <label className="text-[#4B2C7F]">Label</label>
  <input className="border-[#4B2C7F] focus:ring-[#4B2C7F]" />
</div>
```

### Service Card
```jsx
<div className="border-2 border-slate-200">
  <div className="bg-gradient-to-br from-[#4B2C7F]/10 to-[#FFD700]/10">
    <Icon className="text-[#4B2C7F]" />
  </div>
  <h3 className="text-[#4B2C7F]">Title</h3>
  <div className="h-1 bg-[#FFD700]" />
</div>
```

### Logistics Buttons
```jsx
<button className={`
  border-2 transition-all
  ${active 
    ? 'border-[#4B2C7F] bg-white text-[#4B2C7F]'
    : 'border-slate-200 hover:border-[#4B2C7F]/50'
  }
`}>
  Option
</button>
```

---

## 🚀 Implementation Tips

### 1. Consistency
- Always use the exact hex values
- Don't create variations unless necessary
- Use opacity for subtle variations (e.g., `/10`, `/20`, `/50`)

### 2. Contrast
- Purple on white: ✅ WCAG AAA
- Yellow on purple: ✅ WCAG AA
- Purple on yellow: ✅ WCAG AA
- White on purple: ✅ WCAG AAA

### 3. Accessibility
- Don't rely on color alone
- Use icons and text labels
- Ensure focus indicators are visible
- Test with color blindness simulators

### 4. Performance
- Colors are CSS-only (no performance impact)
- Use Tailwind classes for consistency
- Avoid inline styles when possible

---

## 📚 Files to Reference

| File | Purpose |
|------|---------|
| `src/index.css` | CSS variables and global styles |
| `src/pages/Index.tsx` | Home page colors |
| `src/components/DevisForm.tsx` | Form colors |
| `src/components/TravelModule.tsx` | Travel options colors |
| `src/components/VisaAssistantModule.tsx` | Visa form colors |
| `src/components/Navbar.tsx` | Navigation colors |

---

## 🔗 Related Documentation

- **BRAND_OVERHAUL_COMPLETE.md** - Full implementation details
- **COLOR_MIGRATION_GUIDE.md** - Detailed color mapping
- **IMPLEMENTATION_SUMMARY.md** - Project completion summary

---

## 💡 Quick Tips

### Copy-Paste Ready
```
Purple:  #4B2C7F
Yellow:  #FFD700
White:   #FFFFFF
```

### Tailwind Snippets
```
Purple text:     text-[#4B2C7F]
Purple bg:       bg-[#4B2C7F]
Purple border:   border-[#4B2C7F]
Yellow text:     text-[#FFD700]
Yellow bg:       bg-[#FFD700]
Yellow border:   border-[#FFD700]
```

### Hover States
```
Purple hover:    hover:bg-[#3a1f5f]
Yellow hover:    hover:bg-[#FFC700]
```

### Opacity Variants
```
Purple 5%:       bg-[#4B2C7F]/5
Purple 10%:      bg-[#4B2C7F]/10
Purple 20%:      bg-[#4B2C7F]/20
Purple 50%:      bg-[#4B2C7F]/50
```

---

## ❓ FAQ

**Q: Can I use different shades of purple?**
A: Use opacity variants (e.g., `/10`, `/20`, `/50`) instead of creating new colors.

**Q: What if I need a lighter purple?**
A: Use `bg-[#4B2C7F]/10` or `text-[#4B2C7F]/70` for opacity-based lightening.

**Q: Can I mix purple and yellow?**
A: Yes! Use purple for primary elements and yellow for accents/hover states.

**Q: What about dark mode?**
A: Current implementation is light mode only. Dark mode would require separate color variables.

**Q: How do I ensure accessibility?**
A: Always test contrast ratios and use icons/text alongside colors.

---

**Last Updated**: May 6, 2026
**Version**: 1.0
**Status**: ✅ Ready to Use

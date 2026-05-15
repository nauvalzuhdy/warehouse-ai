# Design System Verification Checklist

## ✨ Color System

### Primary Color
- [ ] Primary blue is vivid and clearly visible (NOT gray or too dark)
- [ ] Primary blue works in both light and dark modes
- [ ] Primary color used in buttons and interactive elements shows strong contrast

**Location to verify**: `http://localhost:3000/design-preview` > Colors section

### Priority Colors (AI Insights)
- [ ] **Critical** - Red color with white text is clearly visible
- [ ] **High** - Orange color with white text is clearly visible  
- [ ] **Medium** - Yellow color with dark text is clearly visible
- [ ] **Low** - Green color with white text is clearly visible
- [ ] Each priority color is **distinctly different** from the others

**Location to verify**: `http://localhost:3000/design-preview` > Priority Badges section

---

## 🎯 Component Testing

### PriorityBadge Component
```tsx
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";

// Test each priority level:
<PriorityBadge priority="critical" />  // Should show red with pulsing dot
<PriorityBadge priority="high" />      // Should show orange
<PriorityBadge priority="medium" />    // Should show yellow with dark text
<PriorityBadge priority="low" />       // Should show green
```

Verify:
- [ ] Critical badge shows pulsing red indicator
- [ ] All badges are compact and sit well in table rows
- [ ] Text labels are correct: Kritis, Tinggi, Sedang, Rendah
- [ ] Colors match the color swatches exactly

### Typography
- [ ] H1 is noticeably larger than H2
- [ ] H2 is noticeably larger than H3
- [ ] Body text is readable at normal size
- [ ] Body SM text is smaller but still readable
- [ ] Muted text appears faded/secondary

**Location to verify**: `http://localhost:3000/design-preview` > Typography section

### StatCard Component
- [ ] Card has clean, subtle shadow (not harsh)
- [ ] Icon appears in blue circle on top-right
- [ ] Large number is bold and prominent
- [ ] Trend badge shows green for positive, red for negative
- [ ] Hover effect increases shadow slightly

**Location to verify**: `http://localhost:3000/design-preview` > Stat Cards section

### Buttons
- [ ] Default button is blue (primary color)
- [ ] Secondary button is visible but less prominent
- [ ] Outline button has border only
- [ ] Ghost button is text-only
- [ ] Destructive button is red
- [ ] Hover states work on all buttons

**Location to verify**: `http://localhost:3000/design-preview` > Buttons section

---

## 🌓 Dark Mode Testing

1. Open the design preview page
2. Toggle dark mode (usually in top-right or browser settings)
3. Verify:
   - [ ] Primary blue is still vivid (NOT white/too light)
   - [ ] All priority colors remain distinct and visible
   - [ ] Text remains readable
   - [ ] No colors become washed out

---

## ♿ Accessibility Verification

### Motion Preferences
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Pulsing animation on critical badge stops
- [ ] All transitions/animations are disabled

**How to test on macOS**: System Preferences > Accessibility > Display > Reduce Motion  
**How to test on Windows**: Settings > Ease of Access > Display > Show animations

### Color Contrast
- [ ] Use browser DevTools or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] All text and background color pairs meet WCAG AA (4.5:1 ratio for text)

---

## 🐛 Browser Console

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] **No red error messages** related to:
  - Missing CSS variables
  - Undefined components
  - Color calculation errors
- [ ] No warnings about deprecated Tailwind classes

---

## 📝 Quick Test Commands

```bash
# Start development server
npm run dev

# Open design preview at:
# http://localhost:3000/design-preview

# Check for TypeScript errors:
# npm run lint
```

---

## 🎨 Color Values Reference

### Light Mode (`:root`)
```css
--primary: oklch(0.546 0.197 255.4);           /* Vivid Blue */
--priority-critical: 0 84.2% 60.2%;            /* Red */
--priority-high: 24.6 95% 53.1%;               /* Orange */
--priority-medium: 45.4 93.4% 51.5%;           /* Yellow */
--priority-low: 142.1 70.6% 45.3%;             /* Green */
```

### Dark Mode (`.dark`)
```css
--primary: oklch(0.65 0.19 255.4);             /* Light Blue (NOT white) */
--priority-critical: 0 89.5% 59.7%;            /* Red (brighter) */
--priority-high: 27.4 96% 61%;                 /* Orange (brighter) */
--priority-medium: 48 96.5% 60.1%;             /* Yellow (brighter) */
--priority-low: 142.3 71.8% 58.8%;             /* Green (brighter) */
```

---

## ✅ Final Sign-Off

When all checkboxes are complete, your design system is verified and ready for production use!

**Date Verified**: _______________  
**Verified By**: _______________

---

**Note**: Keep this page at `/design-preview` for development reference only. **Remove before production deployment**.

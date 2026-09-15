

## Contact / Get Estimate Page

Create `/contact` route with a working estimate form (Formspree-ready), contact sidebar, and trust strip. No existing pages or components touched.

### Files to create

**`src/pages/Contact.tsx`** — full page using `PageLayout` and `InnerHero` (height 260px, stone variant).

**`src/components/site/ContactForm.tsx`** — extracted form component with state + validation + success state.

### Files to edit

**`src/App.tsx`** — register `/contact` route above the catch-all.
**`src/components/site/Navbar.tsx`** — point "Get Free Estimate" CTA (desktop + mobile) to `/contact` instead of `#contact`.
**`src/components/site/Footer.tsx`** — point "Request an estimate" link to `/contact`.

### Page structure (`Contact.tsx`)

1. **InnerHero** — stone variant, height `h-[260px]`, title "Let's talk about your project.", subtitle "Tell us what you need and we will get back to you within one business day.", crumbs `Home > Contact`.

2. **Main layout** — `bg-background`, container with `grid lg:grid-cols-5 gap-10`:
   - Left (`lg:col-span-3`): `<ContactForm />` inside a `bg-surface border border-border rounded-lg p-8 md:p-10` card. Card title "Request a Free Estimate" + subtitle.
   - Right (`lg:col-span-2`): sidebar (transparent, no border).
     - Heading "Prefer to call?" (font-display, 2xl).
     - 3 contact blocks. Each: small red dot + label (uppercase tracking, muted) above value (link).
       - Phone → `tel:+15089829675`, "508 982 9675"
       - Email → `mailto:contact@tonyspaintingcmv.com`
       - Service Area → "Martha's Vineyard and Boston Area" (no link)
     - Thin `<Separator />` then muted text "We typically respond within one business day. For urgent requests, please call directly."
     - Social row: Instagram + Facebook (lucide icons), color `text-muted-foreground hover:text-primary`.

3. **Trust strip** — `bg-stone` section, container py-10, `flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12`. Three items, each `flex items-center gap-2` with red `w-1.5 h-1.5 rounded-full bg-primary` + text: "Licensed and Insured", "Free Estimates", "20 Years of Experience".

### Form component (`ContactForm.tsx`)

State: `formData` (6 fields), `errors` (per-field), `submitting`, `submitted`.

Fields rendered with native `<label htmlFor>` + Input/Select/Textarea from `@/components/ui/*`. Order: Full Name, Phone, Email, Property Address, Service Needed (Select with 6 options listed), Tell us about your project (Textarea, rows=4, optional).

Validation on submit: all except project description required, non-empty after trim. Email also checked with simple regex. Invalid fields get `border-destructive` (override input className) + `<p className="text-sm text-destructive mt-1">This field is required.</p>` (or "Please enter a valid email.").

Submit handler:
- Read endpoint from `import.meta.env.VITE_FORMSPREE_ENDPOINT`.
- If endpoint set, `fetch(endpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(formData) })`.
- If not set (mock mode), `await new Promise(r => setTimeout(r, 600))` to simulate.
- On success set `submitted=true`. On failure show toast via `useToast`.

Success state replaces form contents:
- Centered: heading "We got your request." (font-display 3xl), paragraph "Thank you for reaching out. Someone from our team will contact you within one business day.", outline button (`variant="outline"`) "Back to Home" linking to `/` via `react-router-dom` `Link`.

Submit button: `bg-primary hover:bg-primary-dark text-primary-foreground w-full h-12 rounded-sm`, label "Send My Request", disabled while submitting (shows "Sending...").

### Design notes

- Reuses tokens: `bg-stone`, `bg-surface`, `bg-background`, `bg-dark`, `bg-primary`, `text-muted-foreground`, `border-border`. No hard-coded hex.
- Mobile-first: single column under `lg`, sidebar stacks below form.
- All inputs accessible via `htmlFor`/`id` pairs. Select uses Radix shadcn Select with `aria-invalid` on trigger when error present.
- No em dashes anywhere in copy.
- No DB, no secrets requested. Endpoint env var documented inline as a comment in the form file.


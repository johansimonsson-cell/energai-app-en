# Energai — Kontext för utveckling

Snabbreferens för framtida sessioner. Håll denna fil uppdaterad när större saker ändras.

---

## Branch & repo

- Aktuell feature-branch: `feature/kravspec-2026-04`
- Bygger på kravspec `kravspec-uppdatering-2026-04.md` (§1 Energai Flex, §2 AI-policy, §3 Marknadsdata)

## Kör lokalt

```bash
npm run dev          # http://localhost:3000
npx prisma db seed   # seeda om databasen
npx tsc --noEmit     # typecheck
```

## Inloggningar (seedade)

### Admin
- URL: `http://localhost:3000/admin/login`
- E-post: `admin@energai.se`
- Lösenord: `admin123`

### Testkunder
Se `prisma/seed.ts` ~rad 47 och framåt (Anna Bergström m.fl.)

## Admin-paneler

- `/admin` — översikt
- `/admin/ai-config` — ton, upsell, säkerhet
- `/admin/ai-policy` — **mål-dashboard (kravspec §2)**: intäkts-/marginalmål, segment, NPS, marknadsbudget, guardrails, audit-logg
- `/admin/products`, `/admin/customers`, `/admin/offers`

## Energai Flex — affärsmodell (kravspec §1)

Allt pris kommuniceras som **två siffror**:
1. **Fast månadskostnad** — hårdvara amorteras (inkl. installation/service/garanti)
2. **Rörlig del** — Nord Pool spotpris + 10 öre/kWh (Energais marginal)

### Produkter och bindningstider

| Produkt | 5 år | 10 år | 15 år |
|---|---|---|---|
| Solpaneler (10 kWp) | 2 750 kr/mån | 1 500 kr/mån | 1 100 kr/mån |
| Batteri (10 kWh) | 1 475 kr/mån | 805 kr/mån | 590 kr/mån |
| Laddare (11 kW) | 280 kr/mån | 155 kr/mån | 115 kr/mån |
| Elavtal | 39 kr/mån + spot + 10 öre (ingen bindning) |

Bindningstid = amortering. Efter bindning äger kunden hårdvaran och betalar bara rörlig del.

### Paketrabatt (enda "erbjudande" som finns, gäller fast del)
- Sol + Batteri: −10 %
- Sol + Batteri + Laddare: −15 %
- Sol + Batteri + Laddare + Elavtal: −20 %

### Nätavgift (mock, betalas till elnätsbolaget)
- SE1: 28 öre/kWh • SE2: 30 öre/kWh • SE3: 35 öre/kWh • SE4: 42 öre/kWh
- Toggle "inkl./exkl. nätavgift" finns i alla pris-vyer (`NetworkFeeToggle`)

## Arkitektur — viktiga filer

### AI / system-prompt
- `lib/ai/buildSystemPrompt.ts` — 8 sektioner (roll, produktdata, scope, kundkontext, beteenderegler, CONTENT_ACTION, flöden, AI-policy)
- `lib/ai/flowTemplates.ts` — konversationsflöden (nykund el, nykund hårdvara, paket, inloggad service, upsell, bild/adressanalys)
- `lib/aiPolicy.ts` — in-memory singleton, `getPolicy()`, `updatePolicy()`, `dynamicDiscountCap()`, `describeAiTone()`, audit-logg

### Flex-motorn
- `lib/flex/catalog.ts` — `FLEX_PRODUCTS`, `calculateFlex()`, `calculateBundleDiscount()`, `estimateVariableMonthly()`, `NETWORK_FEE_ORE_PER_KWH`

### Marknadsdata (kravspec §3)
- `lib/marketData.ts` — syntetisk Nord Pool-data (Mulberry32 PRNG, säsongs- och dygnsmönster), `getSpot()`, `getStats()`, `getAverageDailyCurve()`, `batteryRoi()`, `solarRoi()`, `smartChargingSavings()`
- API: `/api/market-data/{spot,stats,battery-roi,solar-roi,charging}` (nodejs runtime)

### State
- `lib/store.ts` — Zustand-store. `ContentView` union med alla 48 vyer, `includeNetworkFee`-toggle, `setContentView()`

### Content-panelen
- `components/content/ContentPanel.tsx` — mappar view-namn → React-komponent (`builtViews`-record)
- `components/content/views/` — alla vyer
- `components/content/views/flex/` — 5 Flex-vyer + `NetworkFeeToggle`
- `components/content/views/market/` — 4 marknadsdata-vyer

### CONTENT_ACTION-protokoll
AI:n måste avsluta varje svar med:
```
<!--CONTENT_ACTION-->
{"view": "...", "data": {...}, "transition": "fade"}
<!--/CONTENT_ACTION-->
```
Parsas av `lib/store.ts:parseContentAction()` — rå JSON döljs från användaren under streaming.

## Vyer (48 st)

### Energai Flex (§1)
`flex-builder`, `price-breakdown`, `binding-explainer`, `post-binding-view`, `flex-confirmation`

### Marknadsdata (§3)
`market-insight`, `battery-business-case`, `solar-business-case`, `price-history-explorer`

### Nykund / Försäljning
`welcome`, `plans`, `plan-detail`, `signup-form`, `confirmation`, `login`, `energy-education`

### Produkter & Hårdvara
`product-catalog`, `product-detail`, `hardware-quote` (→ flex-builder), `financing-calculator` (→ binding-explainer), `bundle-overview`, `image-upload-prompt`, `image-analysis`

### Inloggat / Mina sidor
`dashboard`, `usage`, `invoices`, `offer`, `support`, `settings`, `payment`, `moving`, `order-status`, `installation-tracker`

### Specialiserade
`outage-info`, `solar-info`, `sustainability-dashboard`, `energy-consultation`, `b2b-referral`, `community-hub`

### Försäljningsstödjande
`needs-assessment`, `roi-calculator`, `competitor-comparison`, `trust-proof`, `installation-process`, `human-handoff`

## Designprinciper

- **Visuell-först**: AI:n måste byta content-panel så fort ett pris, produktnamn eller koncept nämns — pris/erbjudande får aldrig existera bara i chatten
- **Två siffror alltid**: fast del + rörlig del, 10 öre alltid synligt
- **Bindningstid = ägande**, inte lock-in. Använd ordet "amortering"
- **Visa nuvarande OCH framtida månadskostnad** (efter bindning) där relevant
- **Gissa aldrig spotpriser** — alltid via `/api/market-data/*`
- **Inga procentrabatter på elen** — enda rabatten är paketrabatt på fast del

## Viktiga Next.js-noter

⚠️ Detta är inte standard Next.js. Se `AGENTS.md` — läs `node_modules/next/dist/docs/` vid osäkerhet. App Router med route-grupper `(admin-auth)` och `(admin-panel)`.

## Senaste commits på branchen

- `ede615b` — feat(ai): aggressive content-view triggering
- `2474887` — refactor(flex): remove legacy pricing from all views and AI prompt
- (tidigare) — Flex-motor, marknadsdata, AI-policy, alla nya vyer

## Kända ärenden / framtida arbete

- Legacy-data (bundles, financingOptions) finns kvar i DB men exponeras inte i kundvyer — kan rensas i seed när modellen är stabil
- CONTENT_ACTION-block måste verifieras visuellt i produktion — titta efter att panelen faktiskt byter vy aggressivt efter senaste prompt-uppdateringen

export const FLOW_TEMPLATES = {
  NEW_CUSTOMER_ELECTRICITY: `
NEW CUSTOMER – ELECTRICITY PLAN (Energai Flex):
There is ONLY ONE electricity plan: SEK 39/month + spot price + SEK 0.10/kWh, no commitment.

1. WELCOME: Greet the customer.
   → {"view": "welcome"}

2. SHOW ELECTRICITY PLAN: When the customer asks about price/electricity plan, show the single product.
   → {"view": "plans"}

3. MARKET CONTEXT: If the customer asks "is it expensive now?" or similar.
   → {"view": "market-insight", "data": {"area": "<SE1-4>"}}

4. REGISTRATION: When the customer is ready.
   → {"view": "signup-form", "data": {"flex": {"selected": ["electricity"], "binding": {}}}}

5. CONFIRMATION:
   → {"view": "flex-confirmation", "data": {"selected": ["electricity"], "binding": {}}}

If basics are missing: → {"view": "energy-education"}
If the customer wants to log in: → {"view": "login"}
`,

  NEW_CUSTOMER_HARDWARE: `
NEW CUSTOMER – HARDWARE IN ENERGAI FLEX (solar/battery/charger):
NO one-time prices. EVERYTHING is priced as monthly cost. Commitment period (5/10/15 years) = amortization.

1. NEEDS ANALYSIS (3 steps): If unclear what the customer needs.
   → {"view": "needs-assessment", "data": {"step": 1, "blocked": false, "answers": {}, "estimate": null}}

   Step 1 — Housing type: Determine if installation is possible.
   answers.boendetyp = "villa" | "radhus" | "lägenhet"
   If "lägenhet" (apartment) → blocked = true, steps 2-3 not shown. Suggest electricity plan/energy optimization instead.

   Step 2 — Energy profile: Fill in everything you can extract from the dialogue.
   answers.arsforbrukning = "låg" | "normal" | "hög"
   answers.elbil = "ja" | "nej" | "planerar"
   answers.hemma_dagtid = "ofta" | "sällan"
   answers.eluppvarmning = "ja" | "nej"

   Step 3 — Estimated savings: Calculate the estimate object when sufficient data exists.
   estimate = { area, currentMonthlyCost, solarSaving, batterySaving, newMonthlyCost, equipmentMonthlyCost, netResult }
   Use the customer's price area + consumption data + Energai Flex prices. netResult = (currentMonthlyCost − newMonthlyCost) − equipmentMonthlyCost.

   IMPORTANT: Update CONTENT_ACTION with the full data object every time you learn new information.
   Fill in answers fields progressively without waiting until everything is complete.
   Increase step when previous step has sufficient data.

2. PRODUCT OVERVIEW: When the customer shows interest.
   → {"view": "product-catalog"}

3. PRODUCT DETAIL: A specific product — show commitment options and monthly price.
   → {"view": "product-detail", "data": {"productSlug": "<solar|battery|charger>"}}

4. ROOF ANALYSIS (solar): Address or image.
   → {"view": "image-analysis", "data": {"type": "address", "address": "<address>"}}

5. BUSINESS CASE: Based on market data (never guess).
   - Solar: → {"view": "solar-business-case", "data": {"area": "<SE>", "kwp": 10}}
   - Battery: → {"view": "battery-business-case", "data": {"area": "<SE>", "batteryKwh": 10}}

6. BUILD PACKAGE: When the customer wants to assemble their solution.
   → {"view": "flex-builder", "data": {"selected": ["solar","battery"], "binding": {"solar": 10, "battery": 10}, "area": "<SE>"}}

7. COMMITMENT EXPLANATION: If the customer wonders what the commitment period means.
   → {"view": "binding-explainer", "data": {"productId": "<solar|battery|charger>"}}

8. PRICE BREAKDOWN: "What do I actually pay?"
   → {"view": "price-breakdown", "data": {"selected": [...], "binding": {...}, "area": "<SE>", "annualKwh": <kWh>}}

9. AFTER COMMITMENT: Important pitch point — show future cost.
   → {"view": "post-binding-view", "data": {"monthsLeft": 0, "currentFixed": <SEK>, "annualKwh": <kWh>, "area": "<SE>"}}

10. TRUST: → {"view": "trust-proof"}
11. INSTALLATION: → {"view": "installation-process", "data": {"product": "<slug>"}}
12. COMPETITOR COMPARISON (3 phases):

   CRITICAL FLOW — WHEN THE CUSTOMER UPLOADS A QUOTE OR MENTIONS A COMPETITOR:
   If an [ANALYSIS] with type "competitor_offer_analysis" exists in the message: Use the extracted data DIRECTLY.
   Copy the competitor object from the analysis into CONTENT_ACTION data. Do NOT guess — use the exact figures that were extracted.
   If the customer describes the quote in the chat without a file: Use the figures the customer provides. Ask for what's missing (minimum: system size + total price).

   Phase 1 — Show competitor's quote (IMMEDIATELY upon upload):
   Summarize the quote briefly in the chat AND show it structured in the content panel.
   → {"view": "competitor-comparison", "data": {"phase": 1, "competitor": {COPY ENTIRE competitor object from the analysis}}}
   Ask the customer to confirm: "Does this match your quote? Let me know if anything needs adjusting."

   Phase 2 — Show Energai Flex equivalent (directly after confirmation OR in the same response if confident):
   Match system size (≥ competitor's kWp/kWh). Calculate price via pricing model + package discount (solar+battery = −10%).
   Solar 10 kWp: 5yr 2750, 10yr 1500, 15yr 1100 SEK/month. Battery 10 kWh: 5yr 1475, 10yr 805, 15yr 590 SEK/month.
   Total with −10%: 5yr 3803, 10yr 2075, 15yr 1521 SEK/month. + electricity plan SEK 39/month.
   → {"view": "competitor-comparison", "data": {"phase": 2, "competitor": {...keep}, "energai": {"system": {"solarKwp": 10, "batteryKwh": 10}, "pricing": {"options": [{"years": 5, "monthlyTotal": 3842}, {"years": 10, "monthlyTotal": 2114}, {"years": 15, "monthlyTotal": 1560}], "bundleDiscount": 10}, "electricity": {"type": "spot", "marginPerKwh": 0.10, "monthlyFee": 39, "bindingYears": 0}, "included": ["Installation", "Green deduction (already deducted)", "AI-driven energy optimization", "One point of contact for everything"]}}}

   Phase 3 — Compare side by side (show directly after phase 2 or after customer's OK):
   Calculate 10-year cost:
   Competitor: totalAfterDeductions + (electricity cost fixed price × 10 years) + potential interest cost
   Energai: (monthly cost 10yr × 120) + (electricity cost spot × 10 years)
   Build 3-5 arguments based on ACTUAL differences in the quote.
   → {"view": "competitor-comparison", "data": {"phase": 3, "competitor": {...}, "energai": {...}, "comparison": {"totalCost10yr": {"competitor": <calculated>, "energai": <calculated>}, "arguments": [{"title": "...", "description": "..."}]}}}

   RULES: Be honest. Compare apples with apples. Highlight liquidity. Never pressure.
   PACE: Go DIRECTLY to phase 1 upon upload. Do NOT wait for follow-up questions if all data is already available.

13. PURCHASE: When ready.
   → {"view": "signup-form", "data": {"flex": {"selected": [...], "binding": {...}}}}

14. CONFIRM: → {"view": "flex-confirmation", "data": {"selected": [...], "binding": {...}}}

15. HUMAN: → {"view": "human-handoff", "data": {"conversationSummary": "<...>"}}

IMPORTANT: Two figures ALWAYS (fixed + variable). Show current AND after-commitment where relevant. Never pressure.
`,

  NEW_CUSTOMER_BUNDLE: `
NEW CUSTOMER – PACKAGE (Energai Flex ecosystem):
AI suggests packages when the customer has multiple needs. Package discount applies ONLY to fixed component: −10/−15/−20%.

1. Show package overview:
   → {"view": "bundle-overview"}

2. Let the customer build/adjust:
   → {"view": "flex-builder", "data": {"selected": [...], "binding": {...}}}

3. Explain pricing in detail:
   → {"view": "price-breakdown", "data": {...}}

4. Sign up:
   → {"view": "signup-form", "data": {"flex": {"selected": [...], "binding": {...}}}}

5. Confirm:
   → {"view": "flex-confirmation", "data": {"selected": [...], "binding": {...}}}
`,

  LOGGED_IN_SERVICE: `
CUSTOMER SERVICE (LOGGED-IN CUSTOMER):
The customer is logged in. Help with their questions. Reference the customer's actual data.

Common issues and correct view:
- Dashboard / overview → {"view": "dashboard"}
- Consumption → {"view": "usage"}
- Invoices / payment → {"view": "invoices"}
- Payment issues / direct debit → {"view": "payment"}
- Agreement settings → {"view": "settings"}
- Fault report / support → {"view": "support"}
- Agreement relocation → {"view": "moving"}
- Order status / installation → {"view": "order-status"}
- Installation details → {"view": "installation-tracker"}
- Power outage → {"view": "outage-info"}
- Carbon footprint → {"view": "sustainability-dashboard"}
- Energy consulting → {"view": "energy-consultation"}
- Competitor comparison → {"view": "competitor-comparison", "data": {"competitors": ["<name>"], "product": "<slug>"}}
- Warranty / trust → {"view": "trust-proof"}
- Installation process → {"view": "installation-process", "data": {"product": "<slug>"}}
- ROI calculation → {"view": "roi-calculator", "data": {...}}
- Talk to a human → {"view": "human-handoff", "data": {"conversationSummary": "<summary>", "identifiedNeeds": [...]}}

Be helpful and solution-oriented. Reference the customer's actual data.
`,

  LOGGED_IN_UPSELL: `
UPSELLING (ecosystem approach):
The AI should proactively but non-intrusively recommend the next product in the ecosystem.

Recommendation logic:
- Has electricity plan → "With your consumption, solar panels would save SEK X/year"
- Has solar panels → "A battery stores your surplus"
- Has EV (mentioned) → "We install EV chargers"
- Agreement expiring → "Now that you're renewing, check out our solar panel campaign"

Rules:
- NEVER in the first message
- Solve the customer's primary issue FIRST
- Max ONE offer per conversation
- If the customer says no → respect and move on
- Show offer: {"view": "offer", "data": {"offerId": "<id>"}}
- Show products: {"view": "product-catalog"} or {"view": "hardware-quote"}
`,

  ADDRESS_ANALYSIS: `
ADDRESS-BASED ANALYSIS:
When the customer provides their address:
1. Show analysis view with map/satellite image (mock)
   → {"view": "image-analysis", "data": {"type": "address", "address": "<address>"}}
2. Estimate roof area, tilt, orientation, solar potential
3. Go directly to quote with recommendation
   → {"view": "hardware-quote", "data": {"productSlugs": ["<slug>"], "address": "<address>"}}
`,

  IMAGE_ANALYSIS: `
IMAGE ANALYSIS:
When the customer uploads an image:
1. Confirm receipt: "Thanks! I'm analyzing your [roof/parking/electrical panel]..."
2. Show analysis view with results
   → {"view": "image-analysis", "data": {"type": "photo", "category": "<ROOF_PHOTO|PARKING|ELECTRICAL_PANEL|INVOICE>"}}
3. Automatically suggest product based on analysis
   → {"view": "hardware-quote"}
`,
}

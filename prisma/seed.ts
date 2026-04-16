import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { hashSync } from 'bcryptjs'

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || ''
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

const adapter = new PrismaLibSql({ url, authToken })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clean up existing data for idempotent seeding
  await prisma.spotPrice.deleteMany()
  await prisma.cRMNote.deleteMany()
  await prisma.offerProduct.deleteMany()
  await prisma.bundleProduct.deleteMany()
  await prisma.hardwareOrderItem.deleteMany()
  await prisma.hardwareOrder.deleteMany()
  await prisma.electricityAgreement.deleteMany()
  await prisma.uploadedFile.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.bundle.deleteMany()
  await prisma.financingOption.deleteMany()
  await prisma.knowledgeArticle.deleteMany()
  await prisma.gridOperator.deleteMany()
  await prisma.adminConfig.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // ——— ADMIN USER ———
  const admin = await prisma.user.upsert({
    where: { email: 'admin@energai.se' },
    update: {},
    create: {
      email: 'admin@energai.se',
      password: hashSync('admin123', 10),
      name: 'Admin Energai',
      role: 'ADMIN',
    },
  })

  // ——— TEST CUSTOMERS ———
  const anna = await prisma.user.upsert({
    where: { email: 'anna.bergstrom@example.com' },
    update: {},
    create: {
      email: 'anna.bergstrom@example.com',
      password: hashSync('kund123', 10),
      name: 'Anna Bergström',
      phone: '070-123 45 67',
      role: 'CUSTOMER',
      address: 'Storgatan 12',
      postalCode: '211 34',
      city: 'Malmö',
      priceArea: 'SE4',
      annualConsumptionKwh: 18000,
    },
  })

  const erik = await prisma.user.upsert({
    where: { email: 'erik.johansson@example.com' },
    update: {},
    create: {
      email: 'erik.johansson@example.com',
      password: hashSync('kund123', 10),
      name: 'Erik Johansson',
      phone: '073-456 78 90',
      role: 'CUSTOMER',
      address: 'Kungsgatan 45',
      postalCode: '411 19',
      city: 'Göteborg',
      priceArea: 'SE3',
      annualConsumptionKwh: 22000,
    },
  })

  const patrik = await prisma.user.upsert({
    where: { email: 'patrik.lund@example.com' },
    update: {},
    create: {
      email: 'patrik.lund@example.com',
      password: hashSync('kund123', 10),
      name: 'Patrik Lund',
      phone: '076-789 01 23',
      role: 'CUSTOMER',
      address: 'Nygatan 8',
      postalCode: '972 32',
      city: 'Luleå',
      priceArea: 'SE1',
      annualConsumptionKwh: 25000,
    },
  })

  const thomas = await prisma.user.upsert({
    where: { email: 'thomas.nilsson@example.com' },
    update: {},
    create: {
      email: 'thomas.nilsson@example.com',
      password: hashSync('kund123', 10),
      name: 'Thomas Nilsson',
      phone: '070-234 56 78',
      role: 'CUSTOMER',
      address: 'Villagatan 22',
      postalCode: '582 46',
      city: 'Linköping',
      priceArea: 'SE3',
      annualConsumptionKwh: 28000,
    },
  })

  // ——— PRODUCTS: ELECTRICITY PLANS ———
  const planFixed = await prisma.product.create({
    data: {
      slug: 'elavtal-fast',
      category: 'ELECTRICITY_PLAN',
      name: 'Fixed Price',
      description: 'Predictable electricity cost every month. The price is locked for 12 months regardless of market fluctuations. Perfect if you want control over your budget.',
      shortDescription: 'Locked price for 12 months',
      priceType: 'SUBSCRIPTION',
      basePrice: 89, // öre/kWh
      specifications: JSON.stringify({
        pricePerKwh: 89,
        monthlyFee: 49,
        bindingMonths: 12,
        greenCertified: false,
      }),
      sortOrder: 1,
    },
  })

  const planVariable = await prisma.product.create({
    data: {
      slug: 'elavtal-rorligt',
      category: 'ELECTRICITY_PLAN',
      name: 'Variable Price',
      description: 'Follows Nord Pool spot price hour by hour with a small markup. Historically the cheapest over time for those who are conscious about their consumption.',
      shortDescription: 'Spot price + 4.9 öre markup',
      priceType: 'SUBSCRIPTION',
      basePrice: 4.9, // påslag i öre/kWh
      specifications: JSON.stringify({
        markup: 4.9,
        monthlyFee: 39,
        bindingMonths: 0,
        greenCertified: false,
      }),
      sortOrder: 2,
    },
  })

  const planGreen = await prisma.product.create({
    data: {
      slug: 'elavtal-gron',
      category: 'ELECTRICITY_PLAN',
      name: 'Green Energy',
      description: '100% renewable electricity from Swedish wind and hydropower with guarantees of origin. Certified via RECS/EECS. Climate-neutral and future-proof.',
      shortDescription: '100% renewable energy, 12 months',
      priceType: 'SUBSCRIPTION',
      basePrice: 95, // öre/kWh
      specifications: JSON.stringify({
        pricePerKwh: 95,
        monthlyFee: 49,
        bindingMonths: 12,
        greenCertified: true,
        certification: 'RECS/EECS',
      }),
      sortOrder: 3,
    },
  })

  // ——— PRODUCTS: SOLAR PANELS ———
  const solar6 = await prisma.product.create({
    data: {
      slug: 'solceller-6kw',
      category: 'SOLAR',
      name: 'Solar Panels 6 kW',
      description: 'Perfect for smaller houses and townhouses. The 6 kW system produces approx. 5,700 kWh per year and covers a large portion of a normal household\'s consumption.',
      shortDescription: 'Complete solar panel system 6 kW',
      priceType: 'ONE_TIME',
      basePrice: 89000,
      specifications: JSON.stringify({
        capacity: '6 kW',
        annualProduction: '5 700 kWh',
        panels: 15,
        panelType: 'Monocrystalline',
        inverter: 'Huawei SUN2000-6KTL',
        warranty: '25 years panels, 10 years inverter',
        roofArea: '28 m²',
      }),
      installationIncluded: true,
      installationTimeWeeks: 3,
      warrantyYears: 25,
      eligibleForRot: true,
      eligibleForGreenDeduction: true,
      greenDeductionPercent: 20,
      sortOrder: 4,
    },
  })

  const solar10 = await prisma.product.create({
    data: {
      slug: 'solceller-10kw',
      category: 'SOLAR',
      name: 'Solar Panels 10 kW',
      description: 'Our most popular system. 10 kW covers a normal house\'s entire annual consumption and generates surplus to sell back to the grid during summer.',
      shortDescription: 'Complete solar panel system 10 kW',
      priceType: 'ONE_TIME',
      basePrice: 129000,
      specifications: JSON.stringify({
        capacity: '10 kW',
        annualProduction: '9 500 kWh',
        panels: 25,
        panelType: 'Monocrystalline',
        inverter: 'Huawei SUN2000-10KTL',
        warranty: '25 years panels, 10 years inverter',
        roofArea: '46 m²',
      }),
      installationIncluded: true,
      installationTimeWeeks: 4,
      warrantyYears: 25,
      eligibleForRot: true,
      eligibleForGreenDeduction: true,
      greenDeductionPercent: 20,
      sortOrder: 5,
    },
  })

  const solar15 = await prisma.product.create({
    data: {
      slug: 'solceller-15kw',
      category: 'SOLAR',
      name: 'Solar Panels 15 kW',
      description: 'Maximum system for large houses with high consumption. 15 kW produces approx. 14,250 kWh per year — more than enough to become virtually self-sufficient with a battery.',
      shortDescription: 'Complete solar panel system 15 kW',
      priceType: 'ONE_TIME',
      basePrice: 179000,
      specifications: JSON.stringify({
        capacity: '15 kW',
        annualProduction: '14 250 kWh',
        panels: 38,
        panelType: 'Monocrystalline',
        inverter: 'Huawei SUN2000-15KTL',
        warranty: '25 years panels, 10 years inverter',
        roofArea: '68 m²',
      }),
      installationIncluded: true,
      installationTimeWeeks: 5,
      warrantyYears: 25,
      eligibleForRot: true,
      eligibleForGreenDeduction: true,
      greenDeductionPercent: 20,
      sortOrder: 6,
    },
  })

  // ——— PRODUCTS: BATTERIES ———
  const battery5 = await prisma.product.create({
    data: {
      slug: 'batteri-5kwh',
      category: 'BATTERY',
      name: 'Home Battery 5 kWh',
      description: 'Store solar energy for the evening and night. 5 kWh is enough to power lighting, refrigerator and electronics for 4-6 hours without sun.',
      shortDescription: 'Compact home battery 5 kWh',
      priceType: 'ONE_TIME',
      basePrice: 55000,
      specifications: JSON.stringify({
        capacity: '5 kWh',
        power: '3.68 kW',
        cycles: 6000,
        type: 'LFP (Lithium Iron Phosphate)',
        warranty: '10 years',
        dimensions: '585 x 380 x 172 mm',
        weight: '52 kg',
      }),
      installationIncluded: true,
      installationTimeWeeks: 2,
      warrantyYears: 10,
      eligibleForRot: true,
      sortOrder: 7,
    },
  })

  const battery10 = await prisma.product.create({
    data: {
      slug: 'batteri-10kwh',
      category: 'BATTERY',
      name: 'Home Battery 10 kWh',
      description: 'Maximize your solar investment. 10 kWh stores surplus energy from the day and makes you nearly independent from the grid during summer.',
      shortDescription: 'Home battery 10 kWh',
      priceType: 'ONE_TIME',
      basePrice: 89000,
      specifications: JSON.stringify({
        capacity: '10 kWh',
        power: '5 kW',
        cycles: 6000,
        type: 'LFP (Lithium Iron Phosphate)',
        warranty: '10 years',
        dimensions: '585 x 380 x 344 mm',
        weight: '98 kg',
      }),
      installationIncluded: true,
      installationTimeWeeks: 2,
      warrantyYears: 10,
      eligibleForRot: true,
      sortOrder: 8,
    },
  })

  const battery15 = await prisma.product.create({
    data: {
      slug: 'batteri-15kwh',
      category: 'BATTERY',
      name: 'Home Battery 15 kWh',
      description: 'Our largest battery. Combined with solar panels you can become virtually self-sufficient. Perfect for large households with high consumption.',
      shortDescription: 'Large-scale home battery 15 kWh',
      priceType: 'ONE_TIME',
      basePrice: 115000,
      specifications: JSON.stringify({
        capacity: '15 kWh',
        power: '7.5 kW',
        cycles: 6000,
        type: 'LFP (Lithium Iron Phosphate)',
        warranty: '10 years',
        dimensions: '585 x 380 x 516 mm',
        weight: '142 kg',
      }),
      installationIncluded: true,
      installationTimeWeeks: 3,
      warrantyYears: 10,
      eligibleForRot: true,
      sortOrder: 9,
    },
  })

  // ——— PRODUCTS: CHARGERS ———
  const chargerBas = await prisma.product.create({
    data: {
      slug: 'laddstolpe-bas',
      category: 'CHARGER',
      name: 'Charger Basic',
      description: 'Simple and reliable home charger with 7.4 kW output. Charges your EV overnight — fully charged by morning. RFID lock and app control.',
      shortDescription: 'Home charger 7.4 kW',
      priceType: 'ONE_TIME',
      basePrice: 14900,
      specifications: JSON.stringify({
        power: '7.4 kW',
        phases: 1,
        connector: 'Typ 2',
        cable: '5m cable included',
        features: ['RFID lock', 'App control', 'Energy metering'],
        chargeTime: 'approx. 8h (0-100% for 60 kWh battery)',
      }),
      installationIncluded: true,
      installationTimeWeeks: 1,
      warrantyYears: 5,
      eligibleForRot: true,
      sortOrder: 10,
    },
  })

  const chargerPlus = await prisma.product.create({
    data: {
      slug: 'laddstolpe-plus',
      category: 'CHARGER',
      name: 'Charger Plus',
      description: 'Smart home charger with 11 kW three-phase. Twice as fast as the Basic model. Built-in load balancing, scheduling and dynamic price optimization.',
      shortDescription: 'Smart home charger 11 kW',
      priceType: 'ONE_TIME',
      basePrice: 21900,
      specifications: JSON.stringify({
        power: '11 kW',
        phases: 3,
        connector: 'Typ 2',
        cable: '7m cable included',
        features: ['Load balancing', 'Scheduling', 'Dynamic price optimization', 'RFID', 'App'],
        chargeTime: 'approx. 5.5h (0-100% for 60 kWh battery)',
      }),
      installationIncluded: true,
      installationTimeWeeks: 1,
      warrantyYears: 5,
      eligibleForRot: true,
      sortOrder: 11,
    },
  })

  const chargerPro = await prisma.product.create({
    data: {
      slug: 'laddstolpe-pro',
      category: 'CHARGER',
      name: 'Charger Pro',
      description: 'Premium charger with 22 kW output. Full charge in under 3 hours. Support for solar surplus charging, load balancing and dual outlets.',
      shortDescription: 'Premium charger 22 kW',
      priceType: 'ONE_TIME',
      basePrice: 32900,
      specifications: JSON.stringify({
        power: '22 kW',
        phases: 3,
        connector: 'Typ 2',
        cable: '7m cable included',
        features: ['Dual outlets', 'Solar surplus charging', 'Load balancing', 'OCPP 1.6', 'RFID', 'App'],
        chargeTime: 'approx. 2.7h (0-100% for 60 kWh battery)',
      }),
      installationIncluded: true,
      installationTimeWeeks: 2,
      warrantyYears: 5,
      eligibleForRot: true,
      sortOrder: 12,
    },
  })

  // ——— ELECTRICITY AGREEMENTS FOR TEST CUSTOMERS ———
  await prisma.electricityAgreement.create({
    data: {
      userId: anna.id,
      productId: planFixed.id,
      planType: 'FIXED',
      pricePerKwh: 89,
      monthlyFee: 49,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-06-01'),
      bindingMonths: 12,
      status: 'ACTIVE',
      address: 'Storgatan 12, 211 34 Malmö',
      meterNumber: 'SE-735999-1234567890',
    },
  })

  await prisma.electricityAgreement.create({
    data: {
      userId: erik.id,
      productId: planVariable.id,
      planType: 'VARIABLE',
      pricePerKwh: 4.9,
      monthlyFee: 39,
      startDate: new Date('2025-03-15'),
      bindingMonths: 0,
      status: 'ACTIVE',
      address: 'Kungsgatan 45, 411 19 Göteborg',
      meterNumber: 'SE-735999-9876543210',
    },
  })

  await prisma.electricityAgreement.create({
    data: {
      userId: patrik.id,
      productId: planVariable.id,
      planType: 'VARIABLE',
      pricePerKwh: 4.9,
      monthlyFee: 39,
      startDate: new Date('2025-01-10'),
      bindingMonths: 0,
      status: 'ACTIVE',
      address: 'Nygatan 8, 972 32 Luleå',
      meterNumber: 'SE-735999-1122334455',
    },
  })

  // ——— HARDWARE ORDER FOR THOMAS ———
  const thomasOrder = await prisma.hardwareOrder.create({
    data: {
      userId: thomas.id,
      status: 'SCHEDULED',
      totalPrice: 129000,
      rotDeduction: 15000,
      greenDeduction: 25800,
      netPrice: 88200,
      financingType: 'INSTALLMENT',
      monthlyPayment: 1645,
      installmentMonths: 60,
      interestRate: 3.9,
      installationDate: new Date('2026-05-15'),
      installerNotes: 'South-facing roof, good conditions. No shading issues.',
    },
  })

  await prisma.hardwareOrderItem.create({
    data: {
      orderId: thomasOrder.id,
      productId: solar10.id,
      quantity: 1,
      unitPrice: 129000,
      lineTotal: 129000,
      specifications: JSON.stringify({
        roofOrientation: 'South',
        roofTilt: 30,
        estimatedAnnualProduction: 9500,
      }),
    },
  })

  // ——— BUNDLES ———
  const bundleSolarBas = await prisma.bundle.create({
    data: { name: 'Solar Package Basic', description: 'Solar Panels 6 kW + Green Energy plan — save on electricity and produce your own.', bundleDiscount: 10 },
  })
  await prisma.bundleProduct.createMany({
    data: [
      { bundleId: bundleSolarBas.id, productId: solar6.id },
      { bundleId: bundleSolarBas.id, productId: planGreen.id },
    ],
  })

  const bundleSolarPremium = await prisma.bundle.create({
    data: { name: 'Solar Package Premium', description: 'Solar Panels 10 kW + Battery 10 kWh + Green Energy plan — become nearly self-sufficient.', bundleDiscount: 15 },
  })
  await prisma.bundleProduct.createMany({
    data: [
      { bundleId: bundleSolarPremium.id, productId: solar10.id },
      { bundleId: bundleSolarPremium.id, productId: battery10.id },
      { bundleId: bundleSolarPremium.id, productId: planGreen.id },
    ],
  })

  const bundleEV = await prisma.bundle.create({
    data: { name: 'EV Package', description: 'Charger Plus + Fixed Price plan — charge at home at half the cost compared to public chargers.', bundleDiscount: 5 },
  })
  await prisma.bundleProduct.createMany({
    data: [
      { bundleId: bundleEV.id, productId: chargerPlus.id },
      { bundleId: bundleEV.id, productId: planFixed.id },
    ],
  })

  const bundleTotal = await prisma.bundle.create({
    data: { name: 'Total Package', description: 'Solar Panels 10 kW + Battery 10 kWh + Charger Plus + Green Energy plan — the complete energy ecosystem in one package.', bundleDiscount: 15 },
  })
  await prisma.bundleProduct.createMany({
    data: [
      { bundleId: bundleTotal.id, productId: solar10.id },
      { bundleId: bundleTotal.id, productId: battery10.id },
      { bundleId: bundleTotal.id, productId: chargerPlus.id },
      { bundleId: bundleTotal.id, productId: planGreen.id },
    ],
  })

  // ——— FINANCING OPTIONS ———
  await prisma.financingOption.createMany({
    data: [
      {
        name: 'Installment',
        type: 'INSTALLMENT',
        minAmount: 10000,
        maxAmount: 500000,
        interestRatePercent: 3.9,
        availableTermsMonths: JSON.stringify([36, 60, 120]),
      },
      {
        name: 'Leasing',
        type: 'LEASING',
        minAmount: 30000,
        maxAmount: 500000,
        interestRatePercent: 4.5,
        availableTermsMonths: JSON.stringify([60, 120]),
      },
    ],
  })

  // ——— OFFERS ———
  const offerFast = await prisma.offer.create({
    data: {
      name: 'Fixed price campaign 79 öre',
      description: 'Sign a fixed electricity contract at 79 öre/kWh instead of the regular 89 öre. For new customers.',
      discountPercent: 11,
      discountType: 'PERCENTAGE',
      validUntil: new Date('2026-04-30'),
      targetSegment: 'NEW_CUSTOMER',
    },
  })
  await prisma.offerProduct.create({ data: { offerId: offerFast.id, productId: planFixed.id } })

  const offerGreen = await prisma.offer.create({
    data: {
      name: 'Green energy intro',
      description: '75 öre/kWh for 3 months for new customers who choose Green Energy. Regular price 95 öre.',
      discountPercent: 21,
      discountType: 'PERCENTAGE',
      validUntil: new Date('2026-06-30'),
      targetSegment: 'NEW_CUSTOMER',
    },
  })
  await prisma.offerProduct.create({ data: { offerId: offerGreen.id, productId: planGreen.id } })

  await prisma.offer.create({
    data: {
      name: 'Referral bonus',
      description: 'Refer a friend and get 500 kr discount on your next invoice. Your friend gets the same discount.',
      discountPercent: null,
      discountType: 'FIXED_AMOUNT',
      targetSegment: 'ALL',
    },
  })

  const offerSolar = await prisma.offer.create({
    data: {
      name: 'Spring solar campaign',
      description: '10% extra discount on all solar panel packages. Valid until June 30. Combinable with green deduction.',
      discountPercent: 10,
      discountType: 'PERCENTAGE',
      validUntil: new Date('2026-06-30'),
      targetSegment: 'ALL',
    },
  })
  await prisma.offerProduct.createMany({
    data: [
      { offerId: offerSolar.id, productId: solar6.id },
      { offerId: offerSolar.id, productId: solar10.id },
      { offerId: offerSolar.id, productId: solar15.id },
    ],
  })

  // ——— KNOWLEDGE ARTICLES ———
  const articles = [
    {
      slug: 'natavgift-vs-elhandel',
      category: 'basics',
      title: 'The difference between grid operators and electricity retailers',
      content: 'Your electricity bill consists of two parts: grid fee (to the grid operator that owns the power lines) and electricity trading cost (to us who sell the electricity). The grid operator is responsible for delivering electricity to your home — we at Energai are responsible for getting you the best price. You can freely choose your electricity retailer, but the grid operator is determined by where you live.',
      tags: JSON.stringify(['grid', 'invoice', 'basics']),
      relatedViews: JSON.stringify(['energy-education', 'invoices']),
    },
    {
      slug: 'elprisomraden',
      category: 'basics',
      title: 'Sweden\'s four electricity price areas (SE1-SE4)',
      content: 'Sweden is divided into four electricity price areas: SE1 (Luleå), SE2 (Sundsvall), SE3 (Stockholm) and SE4 (Malmö). Electricity prices can vary between areas — generally prices are lower in the north (SE1-SE2) where there is abundant hydropower, and higher in the south (SE3-SE4) where demand is greater. When moving between areas, your electricity price may change.',
      tags: JSON.stringify(['electricity price', 'price area', 'moving']),
      relatedViews: JSON.stringify(['energy-education', 'moving']),
    },
    {
      slug: 'vad-ar-kwh',
      category: 'basics',
      title: 'What is a kilowatt-hour (kWh)?',
      content: 'A kilowatt-hour (kWh) is the unit we measure electricity consumption in. Example: a washing machine uses about 1 kWh per wash. A house typically consumes 15,000-25,000 kWh per year, an apartment 2,000-5,000 kWh. Your meter records how many kWh you use, and you pay per kWh.',
      tags: JSON.stringify(['kwh', 'consumption', 'basics']),
      relatedViews: JSON.stringify(['energy-education', 'usage']),
    },
    {
      slug: 'hur-teckna-elavtal',
      category: 'contract',
      title: 'How to sign an electricity contract',
      content: 'Signing an electricity contract is easy: 1) Choose contract type (fixed, variable or green). 2) Enter your address and meter number (found on your meter or latest invoice). 3) Fill in your details. 4) Sign digitally. Activation takes 1-2 business days for new contracts, or 2-3 weeks when switching from another provider.',
      tags: JSON.stringify(['electricity contract', 'new customer', 'registration']),
      relatedViews: JSON.stringify(['plans', 'signup-form']),
    },
    {
      slug: 'matarnummer',
      category: 'contract',
      title: 'What is a meter number and where do I find it?',
      content: 'The meter number uniquely identifies your electricity meter. It is 18 digits and starts with SE-735999. You can find it: 1) On your latest electricity invoice. 2) On a sticker on your electricity meter (usually in the electrical cabinet). 3) By contacting your grid operator. You need the meter number when signing or switching electricity contracts.',
      tags: JSON.stringify(['meter number', 'electricity contract', 'new customer']),
      relatedViews: JSON.stringify(['signup-form', 'energy-education']),
    },
    {
      slug: 'betalningsmetoder',
      category: 'payment',
      title: 'Payment methods',
      content: 'Energai offers several payment methods: Direct debit (recommended — paid automatically each month), E-invoice (via your bank), Paper invoice (+29 kr/mo). Hardware purchases can be paid with cash payment, installment (3.9% interest, 36/60/120 months) or leasing (4.5%, 60/120 months).',
      tags: JSON.stringify(['payment', 'direct debit', 'invoice']),
      relatedViews: JSON.stringify(['payment', 'financing-calculator']),
    },
    {
      slug: 'stromavbrott',
      category: 'support',
      title: 'Power outage — what do I do?',
      content: 'Power outages are handled by your grid operator (NOT by Energai). We sell the electricity — the grid operator delivers it. Contact your grid operator directly. For outages > 12 hours you are entitled to statutory compensation. We can help you find the right contact info and register the case.',
      tags: JSON.stringify(['power outage', 'grid', 'support']),
      relatedViews: JSON.stringify(['outage-info', 'support']),
    },
    {
      slug: 'solceller-och-elavtal',
      category: 'solar',
      title: 'Solar panels and electricity contracts — how do they connect?',
      content: 'With solar panels you produce your own electricity. Surplus is sold back to the grid via net metering. You still need an electricity contract for the electricity you buy (evenings, winter). Green deduction gives 20% discount on materials and installation (max 50,000 kr). ROT deduction gives 30% on labor costs (max 50,000 kr/person/year). The combination makes solar panels more profitable.',
      tags: JSON.stringify(['solar panels', 'deduction', 'net metering']),
      relatedViews: JSON.stringify(['solar-info', 'product-catalog', 'hardware-quote']),
    },
    {
      slug: 'gron-el-certifiering',
      category: 'sustainability',
      title: 'Green electricity and certification (RECS/EECS)',
      content: 'Green electricity is certified through guarantees of origin (RECS/EECS). This means that for every kWh you consume, an equivalent amount of renewable electricity has been produced and fed into the grid. Energai\'s green electricity contract uses 100% Swedish wind and hydropower.',
      tags: JSON.stringify(['green electricity', 'certification', 'sustainability']),
      relatedViews: JSON.stringify(['sustainability-dashboard', 'plans']),
    },
    {
      slug: 'avtalsfornyelse',
      category: 'contract',
      title: 'Contract renewal — what happens if I don\'t renew?',
      content: 'When your fixed electricity contract expires, it automatically switches to a default price (usually higher). We recommend renewing 1-2 months before the contract expires. You can renew directly in the chat — we will show current prices and offers.',
      tags: JSON.stringify(['contract', 'renewal', 'default price']),
      relatedViews: JSON.stringify(['plans', 'offer']),
    },
    {
      slug: 'flytta-elavtal',
      category: 'moving',
      title: 'Moving with your electricity contract',
      content: 'When moving: 1) Notify us at least 2 weeks in advance. 2) Notify the grid operator (new and old address). 3) Take a meter reading at the old address. 4) We activate your contract at the new address. NOTE: When moving to a new price area, the price may change.',
      tags: JSON.stringify(['moving', 'address change', 'grid']),
      relatedViews: JSON.stringify(['moving']),
    },
    {
      slug: 'byta-plan',
      category: 'contract',
      title: 'Switching contract type mid-period',
      content: 'Variable contract: can be switched at any time, no binding period. Fixed contract: switching is possible but may incur an early termination fee depending on how long remains. Contact us in the chat to see your options — we always find the best solution.',
      tags: JSON.stringify(['switch', 'contract', 'binding period']),
      relatedViews: JSON.stringify(['plans', 'plan-detail']),
    },
  ]

  for (const article of articles) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    })
  }

  // ——— GRID OPERATORS ———
  await prisma.gridOperator.createMany({
    data: [
      { name: 'Vattenfall Eldistribution', region: 'Stockholm, Norrbotten, Västerbotten etc.', phoneNumber: '08-739 52 00', website: 'https://www.vattenfalleldistribution.se', priceArea: 'SE3' },
      { name: 'E.ON Energidistribution', region: 'Skåne, Blekinge, Halland etc.', phoneNumber: '020-22 22 22', website: 'https://www.eon.se/elnatet', priceArea: 'SE4' },
      { name: 'Ellevio', region: 'Stockholm, Dalarna, Värmland etc.', phoneNumber: '020-00 10 00', website: 'https://www.ellevio.se', priceArea: 'SE3' },
      { name: 'Jämtkraft Grid', region: 'Jämtland', phoneNumber: '063-14 90 00', website: 'https://www.jamtkraft.se', priceArea: 'SE2' },
      { name: 'Skellefteå Kraft Grid', region: 'Skellefteå, Norsjö', phoneNumber: '0910-77 25 00', website: 'https://www.skekraft.se', priceArea: 'SE2' },
    ],
  })

  // ——— SPOT PRICES (90 days mock data per area) ———
  const areas = ['SE1', 'SE2', 'SE3', 'SE4']
  const baseAvg: Record<string, number> = { SE1: 35, SE2: 40, SE3: 65, SE4: 75 }

  const spotPrices: Array<{ priceArea: string; date: Date; hour: number; priceOreKwh: number }> = []
  const now = new Date()
  for (let dayOffset = -90; dayOffset <= 0; dayOffset++) {
    const date = new Date(now)
    date.setDate(date.getDate() + dayOffset)
    date.setHours(0, 0, 0, 0)

    for (const area of areas) {
      const base = baseAvg[area]
      for (let hour = 0; hour < 24; hour++) {
        // Simulate daily price curve: higher during morning/evening peaks
        let hourFactor = 1.0
        if (hour >= 7 && hour <= 9) hourFactor = 1.4
        else if (hour >= 17 && hour <= 20) hourFactor = 1.5
        else if (hour >= 0 && hour <= 5) hourFactor = 0.6

        // Add some randomness
        const noise = (Math.random() - 0.5) * 20
        const seasonFactor = Math.cos((dayOffset + 45) / 90 * Math.PI) * 15 // winter higher

        const price = Math.max(5, Math.round((base * hourFactor + noise + seasonFactor) * 10) / 10)

        spotPrices.push({ priceArea: area, date, hour, priceOreKwh: price })
      }
    }
  }

  // Batch insert spot prices in chunks
  const chunkSize = 500
  for (let i = 0; i < spotPrices.length; i += chunkSize) {
    await prisma.spotPrice.createMany({ data: spotPrices.slice(i, i + chunkSize) })
  }

  // ——— ADMIN CONFIG ———
  const configs = [
    {
      key: 'tone_of_voice',
      value: JSON.stringify({ style: 'Professional', custom: '' }),
      updatedBy: admin.id,
    },
    {
      key: 'welcome_message',
      value: JSON.stringify({ message: 'Hi! Welcome to Energai. I can help you with everything from electricity contracts to solar panels, batteries and chargers. How can I help you?' }),
      updatedBy: admin.id,
    },
    {
      key: 'upsell_settings',
      value: JSON.stringify({ enabled: true, level: 3, maxOffersPerSession: 1 }),
      updatedBy: admin.id,
    },
    {
      key: 'discount_settings',
      value: JSON.stringify({ aiCanGiveDiscount: false, maxDiscountPercent: 10 }),
      updatedBy: admin.id,
    },
    {
      key: 'safety_settings',
      value: JSON.stringify({ requireVerificationForChanges: true, escalateOnComplaints: true, blacklistedTopics: [] }),
      updatedBy: admin.id,
    },
    {
      key: 'response_format',
      value: JSON.stringify({ maxSentences: 3, language: 'english', useEmoji: false }),
      updatedBy: admin.id,
    },
  ]

  for (const config of configs) {
    await prisma.adminConfig.upsert({
      where: { key: config.key },
      update: { value: config.value, updatedBy: config.updatedBy },
      create: config,
    })
  }

  // ——— CRM NOTES FOR TEST CUSTOMERS ———
  await prisma.cRMNote.createMany({
    data: [
      { userId: anna.id, type: 'CHAT', content: 'Customer signed fixed electricity contract at 89 öre. Satisfied with the process.', createdBy: 'AI', createdAt: new Date('2025-06-01') },
      { userId: anna.id, type: 'NOTE', content: 'Customer mentioned interest in solar panels at next contact.', createdBy: 'AI', createdAt: new Date('2025-08-15') },
      { userId: erik.id, type: 'CHAT', content: 'Customer asked about high December invoice. Explained spot price variation.', createdBy: 'AI', createdAt: new Date('2026-01-10') },
      { userId: erik.id, type: 'UPSELL_ATTEMPT', content: 'Suggested fixed price due to volatility. Customer declined, wants to keep variable.', createdBy: 'AI', createdAt: new Date('2026-01-10') },
      { userId: patrik.id, type: 'CHAT', content: 'Customer reported power outage. Referred to Vattenfall Eldistribution.', createdBy: 'AI', createdAt: new Date('2026-02-20') },
      { userId: thomas.id, type: 'HARDWARE_INQUIRY', content: 'Customer ordered solar panels 10 kW. Installation scheduled May 15.', createdBy: 'AI', createdAt: new Date('2026-03-01') },
    ],
  })

  console.log('Seed complete!')
  console.log(`  Users: ${await prisma.user.count()}`)
  console.log(`  Products: ${await prisma.product.count()}`)
  console.log(`  Agreements: ${await prisma.electricityAgreement.count()}`)
  console.log(`  Hardware Orders: ${await prisma.hardwareOrder.count()}`)
  console.log(`  Bundles: ${await prisma.bundle.count()}`)
  console.log(`  Financing Options: ${await prisma.financingOption.count()}`)
  console.log(`  Offers: ${await prisma.offer.count()}`)
  console.log(`  Knowledge Articles: ${await prisma.knowledgeArticle.count()}`)
  console.log(`  Grid Operators: ${await prisma.gridOperator.count()}`)
  console.log(`  Spot Prices: ${await prisma.spotPrice.count()}`)
  console.log(`  Admin Configs: ${await prisma.adminConfig.count()}`)
  console.log(`  CRM Notes: ${await prisma.cRMNote.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

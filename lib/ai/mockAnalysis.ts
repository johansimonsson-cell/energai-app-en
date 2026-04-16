/**
 * Mock image analysis for prototype.
 * In production, this would use Claude Vision API.
 */

export interface RoofAnalysis {
  type: 'roof_analysis'
  usableArea: string
  orientation: string
  tilt: string
  shadingRisk: string
  recommendedSystem: string
  estimatedAnnualProduction: string
  estimatedPrice: number
  estimatedSavingsPerYear: number
  paybackYears: number
}

export interface ParkingAnalysis {
  type: 'parking_analysis'
  parkingType: string
  distance_to_panel: string
  recommendedCharger: string
  estimatedPrice: number
  installationComplexity: string
}

export interface ElectricalPanelAnalysis {
  type: 'electrical_panel_analysis'
  panelType: string
  capacity: string
  compatibility: string
  upgradeNeeded: boolean
  estimatedUpgradeCost: number | null
  notes: string
}

export interface InvoiceAnalysis {
  type: 'invoice_analysis'
  annualConsumption: string
  monthlyAverage: string
  currentCostPerKwh: string
  totalAnnualCost: string
  potentialSavings: string
  recommendation: string
}

export interface CompetitorOfferAnalysis {
  type: 'competitor_offer_analysis'
  competitor: {
    name: string
    offerNumber: string
    validUntil: string
    system: {
      solarPanels: string
      solarKwp: number
      battery: string
      batteryKwh: number
      inverter: string
      inverterKw: number
      estimatedAnnualProduction: number
    }
    pricing: {
      totalBeforeDeductions: number
      greenDeduction: number
      totalAfterDeductions: number
      lineItems: { name: string; price: number }[]
    }
    electricity: {
      type: string
      pricePerKwh: number
      monthlyFee: number
      bindingYears: number
    }
    financing: { type: string; amount?: number; years?: number; rate?: number; monthlyPayment?: number }[]
    warranty: Record<string, string>
    flags: string[]
  }
  instructions: string
}

export interface GenericAnalysis {
  type: 'generic_analysis'
  description: string
}

export type MockAnalysis = RoofAnalysis | ParkingAnalysis | ElectricalPanelAnalysis | InvoiceAnalysis | CompetitorOfferAnalysis | GenericAnalysis

export function getMockImageAnalysis(category: string): MockAnalysis {
  switch (category) {
    case 'ROOF_PHOTO':
      return {
        type: 'roof_analysis',
        usableArea: '42 m²',
        orientation: 'South-southwest',
        tilt: 'approx. 30°',
        shadingRisk: 'Low',
        recommendedSystem: '10 kW',
        estimatedAnnualProduction: '9 500 kWh',
        estimatedPrice: 129000,
        estimatedSavingsPerYear: 14500,
        paybackYears: 6.2,
      }

    case 'PARKING':
      return {
        type: 'parking_analysis',
        parkingType: 'Driveway/carport',
        distance_to_panel: 'approx. 8 meters to electrical panel',
        recommendedCharger: 'Charger Plus (11 kW)',
        estimatedPrice: 21900,
        installationComplexity: 'Standard',

      }

    case 'ELECTRICAL_PANEL':
      return {
        type: 'electrical_panel_analysis',
        panelType: 'Schneider Electric',
        capacity: '25A three-phase',
        compatibility: 'Compatible with charger and solar panels',
        upgradeNeeded: false,
        estimatedUpgradeCost: null,
        notes: 'The panel capacity is sufficient for installing both a charger (11 kW) and solar inverter. No upgrades needed.',
      }

    case 'INVOICE':
      return {
        type: 'invoice_analysis',
        annualConsumption: '18 500 kWh',
        monthlyAverage: '1 542 kWh',
        currentCostPerKwh: '1.85 kr (incl. grid fee, tax)',
        totalAnnualCost: '34,225 kr',
        potentialSavings: 'With 10 kW solar panels you can save approx. 14,500 kr/year',
        recommendation: 'Your consumption is high enough to justify a solar panel system. With the 10 kW system and net metering you can halve your electricity cost.',
      }

    case 'COMPETITOR_OFFER':
      return {
        type: 'competitor_offer_analysis',
        competitor: {
          name: 'Solelkompaniet',
          offerNumber: 'SOL-2026-04871',
          validUntil: '2026-05-10',
          system: {
            solarPanels: '18 st JA Solar 440W',
            solarKwp: 7.92,
            battery: 'Huawei LUNA2000',
            batteryKwh: 10,
            inverter: 'Huawei SUN2000-8KTL',
            inverterKw: 8,
            estimatedAnnualProduction: 7200,
          },
          pricing: {
            totalBeforeDeductions: 254600,
            greenDeduction: 50000,
            totalAfterDeductions: 204600,
            lineItems: [
              { name: 'Solar panel package (18x JA Solar 440W)', price: 119900 },
              { name: 'Battery storage (Huawei LUNA2000 10 kWh)', price: 74500 },
              { name: 'Installation', price: 38500 },
              { name: 'Mounting & cable', price: 12800 },
              { name: 'Project planning', price: 8900 },
            ],
          },
          electricity: {
            type: 'fixed',
            pricePerKwh: 0.89,
            monthlyFee: 49,
            bindingYears: 3,
          },
          financing: [
            { type: 'cash', amount: 204600 },
            { type: 'loan', years: 10, rate: 5.95, monthlyPayment: 2246 },
            { type: 'loan', years: 15, rate: 6.45, monthlyPayment: 1762 },
          ],
          warranty: {
            panels: '25 years product, 30 years performance',
            battery: '10 years',
            inverter: '10 years',
            installation: '5 years',
          },
          flags: [
            'Installation cost: 38,500 kr included in total price',
            'Payment: 30% at order, 70% at commissioning',
            'Early termination fee electricity contract: 1,500 kr',
          ],
        },
        instructions: 'IMPORTANT: This data is extracted from the customer\'s competitor offer. Use it DIRECTLY to populate the competitor-comparison view. Show phase 1 with this data immediately, ask the customer to confirm, then build phase 2 (Energai equivalent) and phase 3 (comparison). Send the ENTIRE competitor object in CONTENT_ACTION data.',
      } as CompetitorOfferAnalysis

    default:
      return {
        type: 'generic_analysis',
        description: 'The image has been analyzed. Contact us for a more detailed assessment.',
      }
  }
}

/**
 * Mock address-based solar analysis.
 * In production, this would use Google Maps Solar API.
 */
export function getMockAddressAnalysis(address: string): RoofAnalysis & { address: string; mapUrl: string; priceArea: string } {
  // Determine price area from city/region in address
  const addressLower = address.toLowerCase()
  let priceArea = 'SE3'
  let production = 9500
  let price = 129000

  if (addressLower.includes('luleå') || addressLower.includes('kiruna') || addressLower.includes('gällivare')) {
    priceArea = 'SE1'
    production = 7500
  } else if (addressLower.includes('sundsvall') || addressLower.includes('östersund') || addressLower.includes('umeå')) {
    priceArea = 'SE2'
    production = 8000
  } else if (addressLower.includes('malmö') || addressLower.includes('lund') || addressLower.includes('helsingborg') || addressLower.includes('kristianstad')) {
    priceArea = 'SE4'
    production = 10200
    price = 129000
  } else if (addressLower.includes('göteborg') || addressLower.includes('linköping') || addressLower.includes('norrköping') || addressLower.includes('stockholm') || addressLower.includes('nacka') || addressLower.includes('solna') || addressLower.includes('huddinge')) {
    priceArea = 'SE3'
    production = 9500
  }

  const savingsPerYear = Math.round(production * 1.2) // ~1.2 kr/kWh total savings
  const payback = Math.round((price * 0.6 / savingsPerYear) * 10) / 10 // after deductions

  return {
    type: 'roof_analysis',
    address,
    mapUrl: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=600x400&maptype=satellite`,
    priceArea,
    usableArea: '45 m²',
    orientation: 'South',
    tilt: 'approx. 25-30°',
    shadingRisk: 'Low',
    recommendedSystem: '10 kW',
    estimatedAnnualProduction: `${production.toLocaleString('sv-SE')} kWh`,
    estimatedPrice: price,
    estimatedSavingsPerYear: savingsPerYear,
    paybackYears: payback,
  }
}

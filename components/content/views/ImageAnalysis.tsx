'use client'

import { useState, useEffect } from 'react'

interface AnalysisResult {
  type: string
  usableArea?: string
  orientation?: string
  tilt?: string
  shadingRisk?: string
  recommendedSystem?: string
  estimatedAnnualProduction?: string
  estimatedPrice?: number
  estimatedSavingsPerYear?: number
  paybackYears?: number
  address?: string
  priceArea?: string
  parkingType?: string
  recommendedCharger?: string
  installationComplexity?: string
  panelType?: string
  capacity?: string
  compatibility?: string
  upgradeNeeded?: boolean
  annualConsumption?: string
  currentCostPerKwh?: string
  totalAnnualCost?: string
  potentialSavings?: string
  recommendation?: string
}

const resultFields: Record<string, { label: string; key: keyof AnalysisResult }[]> = {
  roof_analysis: [
    { label: 'Roof area', key: 'usableArea' },
    { label: 'Orientation', key: 'orientation' },
    { label: 'Tilt', key: 'tilt' },
    { label: 'Shading risk', key: 'shadingRisk' },
  ],
  parking_analysis: [
    { label: 'Type', key: 'parkingType' },
    { label: 'Recommended', key: 'recommendedCharger' },
    { label: 'Complexity', key: 'installationComplexity' },
  ],
  electrical_panel_analysis: [
    { label: 'Panel type', key: 'panelType' },
    { label: 'Capacity', key: 'capacity' },
    { label: 'Compatibility', key: 'compatibility' },
  ],
  invoice_analysis: [
    { label: 'Annual consumption', key: 'annualConsumption' },
    { label: 'Cost/kWh', key: 'currentCostPerKwh' },
    { label: 'Annual cost', key: 'totalAnnualCost' },
  ],
}

export function ImageAnalysis({ data }: { data: Record<string, unknown> }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const analysisType = data.type as string
  const address = data.address as string

  useEffect(() => {
    if (analysisType === 'address' && address) {
      fetch(`/api/address-analysis/${encodeURIComponent(address)}`)
        .then(r => r.json())
        .then(d => { setAnalysis(d); setLoading(false) })
        .catch(() => setLoading(false))
    } else {
      // Mock: use data passed from AI or simulate a short delay
      setTimeout(() => {
        setAnalysis({
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
        })
        setLoading(false)
      }, 800)
    }
  }, [analysisType, address])

  const fields = analysis ? (resultFields[analysis.type] || resultFields.roof_analysis) : []

  return (
    <section style={{ display: 'flex', flexDirection: 'column', margin: 'calc(-1 * var(--space-10))' }}>
      {/* Dark hero section */}
      <div style={{
        background: 'var(--color-black)',
        padding: 'var(--space-10)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-heading-lg)',
          fontWeight: 700,
          color: 'var(--color-white)',
          margin: 0,
        }}>
          {loading ? 'Analyzing...' : 'Analysis complete'}
        </h2>

        {address && (
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {address}
          </p>
        )}

        {/* Loading bar */}
        {loading && (
          <div style={{ height: '2px', background: 'var(--color-gray-800)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-accent)', animation: 'progress-bar 2s ease-in-out infinite' }} />
          </div>
        )}

        {/* Image/map placeholder */}
        <div style={{
          width: '100%',
          height: '200px',
          background: 'var(--color-gray-900)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {address ? (
            <span style={{ color: 'var(--color-gray-500)', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)' }}>
              Satellite image: {address}
            </span>
          ) : (
            <span style={{ color: 'var(--color-gray-500)', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)' }}>
              Uploaded image
            </span>
          )}
        </div>
      </div>

      {/* Light results section */}
      {analysis && !loading && (
        <div style={{
          background: 'var(--color-gray-25)',
          padding: 'var(--space-10)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
        }}>
          {/* Result grid */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(fields.length, 4)}, 1fr)`, gap: 0 }}>
            {fields.map((field, i) => (
              <div
                key={field.key}
                className="stagger-item"
                style={{
                  borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
                  paddingLeft: i === 0 ? 0 : 'var(--space-6)',
                  paddingRight: 'var(--space-6)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-heading-lg)',
                  fontWeight: 700,
                  color: 'var(--color-black)',
                  display: 'block',
                }}>
                  {String(analysis[field.key] || '—')}
                </span>
                <span style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  color: 'var(--color-gray-600)',
                  fontWeight: 400,
                }}>
                  {field.label}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation summary for roof/address */}
          {analysis.type === 'roof_analysis' && analysis.recommendedSystem && (
            <div style={{
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: 'var(--space-6)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
                Recommendation: {analysis.recommendedSystem}
              </h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', margin: 0 }}>
                Estimated production: {analysis.estimatedAnnualProduction}/year.
                Savings: approx. {analysis.estimatedSavingsPerYear?.toLocaleString('sv-SE')} kr/year.
                Payback period: {analysis.paybackYears} years.
              </p>
            </div>
          )}

          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Write in the chat to proceed to a quote.
          </p>
        </div>
      )}

      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        @media (max-width: 767px) {
          section > div > div[style*="grid-template-columns"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--space-6) 0 !important;
          }
        }
      `}</style>
    </section>
  )
}

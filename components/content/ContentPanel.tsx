'use client'

import { useAppStore, type ContentView } from '@/lib/store'
import { useMemo, useState, useEffect, useRef } from 'react'
import { WelcomeView } from './views/WelcomeView'
import { PlansOverview } from './views/PlansOverview'
import { PlanDetail } from './views/PlanDetail'
import { SignupForm } from './views/SignupForm'
import { ConfirmationView } from './views/ConfirmationView'
import { LoginView } from './views/LoginView'
import { DashboardView } from './views/DashboardView'
import { UsageView } from './views/UsageView'
import { InvoicesView } from './views/InvoicesView'
import { OfferView } from './views/OfferView'
import { SettingsView } from './views/SettingsView'
import { SupportView } from './views/SupportView'
import { EnergyEducationView } from './views/EnergyEducationView'
import { ProductCatalog } from './views/ProductCatalog'
import { ProductDetail } from './views/ProductDetail'
import { ImageUploadPrompt } from './views/ImageUploadPrompt'
import { ImageAnalysis } from './views/ImageAnalysis'
import { HardwareQuote } from './views/HardwareQuote'
import { FinancingCalculator } from './views/FinancingCalculator'
import { BundleOverview } from './views/BundleOverview'
import { PaymentView } from './views/PaymentView'
import { MovingView } from './views/MovingView'
import { OutageInfoView } from './views/OutageInfoView'
import { SustainabilityDashboard } from './views/SustainabilityDashboard'
import { EnergyConsultationView } from './views/EnergyConsultationView'
import { OrderStatusView } from './views/OrderStatusView'
import { InstallationTracker } from './views/InstallationTracker'
import { SolarInfoView } from './views/SolarInfoView'
import { B2BReferralView } from './views/B2BReferralView'
import { CommunityHubView } from './views/CommunityHubView'
import { PlaceholderView } from './views/PlaceholderView'
import { NeedsAssessmentView } from './views/NeedsAssessmentView'
import { RoiCalculatorView } from './views/RoiCalculatorView'
import { CompetitorComparisonView } from './views/CompetitorComparisonView'
import { TrustProofView } from './views/TrustProofView'
import { InstallationProcessView } from './views/InstallationProcessView'
import { HumanHandoffView } from './views/HumanHandoffView'
// Energai Flex (kravspec 2026-04 §1)
import { FlexBuilderView } from './views/flex/FlexBuilderView'
import { PriceBreakdownView } from './views/flex/PriceBreakdownView'
import { BindingExplainerView } from './views/flex/BindingExplainerView'
import { PostBindingView } from './views/flex/PostBindingView'
import { FlexConfirmationView } from './views/flex/FlexConfirmationView'
// Marknadsdata (kravspec 2026-04 §3)
import { MarketInsightView } from './views/market/MarketInsightView'
import { BatteryBusinessCaseView } from './views/market/BatteryBusinessCaseView'
import { SolarBusinessCaseView } from './views/market/SolarBusinessCaseView'
import { PriceHistoryExplorerView } from './views/market/PriceHistoryExplorerView'

const builtViews: Record<string, React.ComponentType<{ data: Record<string, unknown> }>> = {
  welcome: WelcomeView,
  plans: PlansOverview,
  'plan-detail': PlanDetail,
  'signup-form': SignupForm,
  confirmation: ConfirmationView,
  login: LoginView,
  'energy-education': EnergyEducationView,
  'product-catalog': ProductCatalog,
  'product-detail': ProductDetail,
  'image-upload-prompt': ImageUploadPrompt,
  'image-analysis': ImageAnalysis,
  'hardware-quote': HardwareQuote,
  'financing-calculator': FinancingCalculator,
  'bundle-overview': BundleOverview,
  dashboard: DashboardView,
  usage: UsageView,
  invoices: InvoicesView,
  offer: OfferView,
  settings: SettingsView,
  support: SupportView,
  payment: PaymentView,
  moving: MovingView,
  'outage-info': OutageInfoView,
  'sustainability-dashboard': SustainabilityDashboard,
  'energy-consultation': EnergyConsultationView,
  'order-status': OrderStatusView,
  'installation-tracker': InstallationTracker,
  'solar-info': SolarInfoView,
  'b2b-referral': B2BReferralView,
  'community-hub': CommunityHubView,
  'needs-assessment': NeedsAssessmentView,
  'roi-calculator': RoiCalculatorView,
  'competitor-comparison': CompetitorComparisonView,
  'trust-proof': TrustProofView,
  'installation-process': InstallationProcessView,
  'human-handoff': HumanHandoffView,
  // Flex
  'flex-builder': FlexBuilderView,
  'price-breakdown': PriceBreakdownView,
  'binding-explainer': BindingExplainerView,
  'post-binding-view': PostBindingView,
  'flex-confirmation': FlexConfirmationView,
  // Marknadsdata
  'market-insight': MarketInsightView,
  'battery-business-case': BatteryBusinessCaseView,
  'solar-business-case': SolarBusinessCaseView,
  'price-history-explorer': PriceHistoryExplorerView,
}

const darkViews = new Set<ContentView>([
  'welcome', 'confirmation', 'offer',
  'outage-info', 'sustainability-dashboard', 'trust-proof',
  'flex-confirmation',
])

const mixedViews = new Set<ContentView>([
  'dashboard', 'image-analysis', 'hardware-quote',
  'roi-calculator', 'human-handoff',
])

function makePlaceholder(viewName: string, dark: boolean) {
  const Component = ({ data }: { data: Record<string, unknown> }) => (
    <PlaceholderView data={data} viewName={viewName} dark={dark} />
  )
  Component.displayName = `Placeholder_${viewName}`
  return Component
}

export function ContentPanel() {
  const { contentState, isStreaming } = useAppStore()
  const { view, data } = contentState

  const [visible, setVisible] = useState(true)
  const [currentView, setCurrentView] = useState(view)
  const [currentData, setCurrentData] = useState(data)
  const prevView = useRef(view)

  // When view changes: fade out, swap, fade in
  useEffect(() => {
    if (view !== prevView.current) {
      prevView.current = view
      setVisible(false)
      const timer = setTimeout(() => {
        setCurrentView(view)
        setCurrentData(data)
        setVisible(true)
      }, 200) // match --duration-fast
      return () => clearTimeout(timer)
    } else {
      // Data changed but same view — update immediately
      setCurrentData(data)
    }
  }, [view, data])

  const ViewComponent = useMemo(() => {
    if (builtViews[currentView]) return builtViews[currentView]
    const isDark = darkViews.has(currentView) || mixedViews.has(currentView)
    return makePlaceholder(currentView, isDark)
  }, [currentView])

  const isDark = darkViews.has(currentView) || mixedViews.has(currentView)

  return (
    <main
      style={{
        background: isDark ? 'var(--color-black)' : 'var(--color-gray-25)',
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        transition: 'background var(--duration-medium) var(--ease-default)',
      }}
      aria-label="Content"
      aria-live="polite"
    >
      {isStreaming && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            background: 'var(--color-accent)',
            zIndex: 10,
            animation: 'progress-bar 2s ease-in-out infinite',
          }}
        />
      )}

      <div
        style={{
          padding: 'var(--space-10)',
          maxWidth: 'var(--grid-max-width)',
          margin: '0 auto',
          height: '100%',
        }}
      >
        <div
          className="content-view-transition"
          style={{
            height: '100%',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <ViewComponent data={currentData} />
        </div>
      </div>

      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .content-view-transition {
            transition: opacity var(--duration-fast) var(--ease-enter),
                        transform var(--duration-fast) var(--ease-enter);
          }
        }
        @media (max-width: 767px) {
          main > div {
            padding: var(--space-5) !important;
          }
        }
      `}</style>
    </main>
  )
}

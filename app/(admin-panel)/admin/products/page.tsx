'use client'

import { useEffect, useState, useCallback } from 'react'

interface Product {
  id: string
  slug: string
  category: string
  name: string
  description: string
  shortDescription: string | null
  basePrice: number
  priceType: string
  isActive: boolean
  installationIncluded: boolean
  installationTimeWeeks: number | null
  warrantyYears: number | null
  eligibleForRot: boolean
  eligibleForGreenDeduction: boolean
  greenDeductionPercent: number | null
  sortOrder: number
}

const categoryLabels: Record<string, string> = {
  ELECTRICITY_PLAN: 'Electricity plans',
  SOLAR: 'Solar panels',
  BATTERY: 'Batteries',
  CHARGER: 'Chargers',
}

const categoryOrder = ['ELECTRICITY_PLAN', 'SOLAR', 'BATTERY', 'CHARGER']

function formatPrice(p: Product): string {
  if (p.priceType === 'SUBSCRIPTION') return `${p.basePrice} öre/kWh`
  return `${p.basePrice.toLocaleString('sv-SE')} kr`
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Product>>({})
  const [filter, setFilter] = useState<string>('all')

  const loadProducts = useCallback(() => {
    fetch('/api/admin/products').then(r => r.json()).then(setProducts).catch(console.error)
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const handleSave = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setEditing(null)
    setEditData({})
    loadProducts()
  }

  const handleToggleActive = async (product: Product) => {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    })
    loadProducts()
  }

  const startEdit = (product: Product) => {
    setEditing(product.id)
    setEditData({ name: product.name, description: product.description, basePrice: product.basePrice })
  }

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter)

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-2) 0',
    border: 'none',
    borderBottom: '1.5px solid var(--color-gray-300)',
    background: 'transparent',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-body-sm)',
    outline: 'none',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--color-black)', margin: 0 }}>
          Products
        </h1>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)' }}>
          {products.length} products
        </span>
      </div>

      {/* Category filter */}
      <nav style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <button onClick={() => setFilter('all')} style={{
          background: 'none', border: 'none', borderBottom: filter === 'all' ? '2px solid var(--color-black)' : '2px solid transparent',
          padding: 'var(--space-2) 0', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)',
          fontWeight: filter === 'all' ? 500 : 400, color: filter === 'all' ? 'var(--color-black)' : 'var(--color-gray-500)', cursor: 'pointer', minHeight: '44px',
        }}>All</button>
        {categoryOrder.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            background: 'none', border: 'none', borderBottom: filter === cat ? '2px solid var(--color-black)' : '2px solid transparent',
            padding: 'var(--space-2) 0', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)',
            fontWeight: filter === cat ? 500 : 400, color: filter === cat ? 'var(--color-black)' : 'var(--color-gray-500)', cursor: 'pointer', minHeight: '44px',
          }}>{categoryLabels[cat]}</button>
        ))}
      </nav>

      {/* Products table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Product', 'Category', 'Price', 'Status', ''].map(h => (
              <th key={h} style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 400, color: 'var(--color-gray-600)', textAlign: 'left', padding: 'var(--space-3) var(--space-4) var(--space-3) 0', borderTop: '1.5px solid var(--color-gray-200)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(product => (
            <tr key={product.id}>
              <td style={{ padding: 'var(--space-4) var(--space-4) var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)', verticalAlign: 'top' }}>
                {editing === product.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <input value={editData.name || ''} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                    <textarea value={editData.description || ''} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                ) : (
                  <div>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, display: 'block' }}>{product.name}</span>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)' }}>{product.slug}</span>
                  </div>
                )}
              </td>
              <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', padding: 'var(--space-4) var(--space-4) var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                {categoryLabels[product.category] || product.category}
              </td>
              <td style={{ padding: 'var(--space-4) var(--space-4) var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                {editing === product.id ? (
                  <input type="number" value={editData.basePrice || 0} onChange={e => setEditData(p => ({ ...p, basePrice: Number(e.target.value) }))} style={{ ...inputStyle, width: '120px' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500 }}>{formatPrice(product)}</span>
                )}
              </td>
              <td style={{ padding: 'var(--space-4) var(--space-4) var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                <button onClick={() => handleToggleActive(product)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)',
                  fontWeight: 500, color: product.isActive ? 'var(--color-success)' : 'var(--color-gray-400)',
                }}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td style={{ padding: 'var(--space-4) 0 var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)', textAlign: 'right' }}>
                {editing === product.id ? (
                  <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleSave(product.id)} style={{ background: 'var(--color-black)', color: 'var(--color-white)', border: 'none', padding: '8px 16px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', cursor: 'pointer', minHeight: '36px' }}>Save</button>
                    <button onClick={() => { setEditing(null); setEditData({}) }} style={{ background: 'transparent', color: 'var(--color-gray-500)', border: '1px solid var(--color-gray-200)', padding: '8px 16px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', cursor: 'pointer', minHeight: '36px' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(product)} style={{ background: 'transparent', color: 'var(--color-gray-500)', border: '1px solid var(--color-gray-200)', padding: '8px 16px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', cursor: 'pointer', minHeight: '36px' }}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

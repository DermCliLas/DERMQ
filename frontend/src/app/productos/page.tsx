'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS_DATA, type Product } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { getProductsPaginated } from '@/lib/api'

const PAGE_SIZE = 12

const CATALOG_CATEGORIES = [
  'Cuidado Dermatológico',
  'Renovadores Celulares',
  'Anti-Acné',
  'Despigmentantes',
  'Queratolíticos',
  'Corticoides',
  'Astringentes',
  'Antibióticos',
  'Antimicóticos',
  'Tratamiento Capilar',
  'Anestésicos',
]

type PriceSortOption = 'name_asc' | 'price_desc' | 'price_asc'

// Helper dynamically mapping category based on name for catalog filter uniformity
function getProductCategory(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('retinoico')) return 'Renovadores Celulares';
  if (lowercaseName.includes('benzoilo') || lowercaseName.includes('acné') || lowercaseName.includes('acne')) return 'Anti-Acné';
  if (lowercaseName.includes('hidroquinona') || lowercaseName.includes('despigmentante')) return 'Despigmentantes';
  if (lowercaseName.includes('láctico') || lowercaseName.includes('lactico') || lowercaseName.includes('salicílico') || lowercaseName.includes('salicilico') || lowercaseName.includes('urea')) return 'Queratolíticos';
  if (lowercaseName.includes('clobetasol') || lowercaseName.includes('triamcinolona')) return 'Corticoides';
  if (lowercaseName.includes('aluminio')) return 'Astringentes';
  if (lowercaseName.includes('eritromicina')) return 'Antibióticos';
  if (lowercaseName.includes('econazol')) return 'Antimicóticos';
  if (lowercaseName.includes('minoxidil')) return 'Tratamiento Capilar';
  if (lowercaseName.includes('anestesia') || lowercaseName.includes('lidocaina') || lowercaseName.includes('lidocaína')) return 'Anestésicos';
  return 'Cuidado Dermatológico'; // Categoria default
}

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<PriceSortOption>('name_asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<(Product & { description?: string; stock?: number }) | null>(null)
  const { addToCart } = useCart()
  
  const [productsList, setProductsList] = useState<(Product & { description?: string; stock?: number })[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [usingFallback, setUsingFallback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Debounce search input (350ms) to avoid hammering Supabase on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      try {
        setIsLoading(true)
        const res = await getProductsPaginated({
          active: true,
          page: currentPage,
          limit: PAGE_SIZE,
          sort: sortOrder,
          search: debouncedSearch || undefined,
          category: selectedCategory || undefined,
        })
        if (cancelled) return

        if (res && (res.data.length > 0 || debouncedSearch || selectedCategory)) {
          const mappedProducts = res.data.map((p: any) => ({
            id: p.id,
            code: p.sku || p.code || 'DERM',
            name: p.name,
            category: p.category || getProductCategory(p.name),
            price: Number(p.price) || 90.00,
            imageUrl: p.imageUrl || '/product_tube.png',
            description: p.description || '',
            stock: typeof p.stock === 'number' ? p.stock : undefined,
          }))
          setProductsList(mappedProducts)
          setTotalItems(res.meta.total)
          setTotalPages(Math.max(1, res.meta.totalPages))
          setUsingFallback(false)
        } else {
          setUsingFallback(true)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching products from API, falling back to static mocks:', err)
          setUsingFallback(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    loadProducts()
    return () => {
      cancelled = true
    }
  }, [currentPage, sortOrder, debouncedSearch, selectedCategory])

  // Client-side pagination & sorting when using offline fallback data
  const fallbackResult = useMemo(() => {
    if (!usingFallback) return null
    const filtered = PRODUCTS_DATA.filter(p => {
      const matchesSearch = !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true
      return matchesSearch && matchesCategory
    })
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'price_desc') return b.price - a.price
      if (sortOrder === 'price_asc') return a.price - b.price
      return a.name.localeCompare(b.name)
    })
    const total = sorted.length
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const start = (currentPage - 1) * PAGE_SIZE
    return {
      items: sorted.slice(start, start + PAGE_SIZE),
      total,
      totalPages: pages,
    }
  }, [usingFallback, debouncedSearch, selectedCategory, sortOrder, currentPage])

  const displayedProducts = usingFallback ? (fallbackResult?.items || []) : productsList
  const effectiveTotal = usingFallback ? (fallbackResult?.total || 0) : totalItems
  const effectiveTotalPages = usingFallback ? (fallbackResult?.totalPages || 1) : totalPages

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => {
      setAddedId(prev => (prev === product.id ? null : prev))
    }, 1200)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > effectiveTotalPages) return
    setCurrentPage(newPage)
    window.scrollTo({ top: 220, behavior: 'smooth' })
  }

  return (
    <main className="pt-0">
      <section className="pt-8 pb-24 bg-[#f8fafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#014d4e]/10 border border-[#014d4e]/20 text-[#014d4e] text-xs font-bold uppercase tracking-widest mb-6">
                DERMQ Shop
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-[#1a1c1e] leading-[1.05]">
                Cuida tu piel,{' '}
                <span className="text-[#F0A17E] italic">cada día.</span>
              </h1>
            </div>
            <p className="text-on-surface-variant font-medium max-w-sm">
              Selección dermatológica de grado clínico formulada y recomendada por nuestros especialistas.
            </p>
          </div>

          {/* Filters, Price Sort and Search */}
          <div className="bg-white p-4 lg:p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative w-full lg:flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Buscar producto o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#72c1c1] transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title="Limpiar búsqueda"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>

              {/* Selector de Ordenamiento por Precio */}
              <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
                <span className="material-symbols-outlined text-[#014d4e] text-xl">swap_vert</span>
                <label htmlFor="price-sort" className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  Ordenar:
                </label>
                <select
                  id="price-sort"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as PriceSortOption)
                    setCurrentPage(1)
                  }}
                  className="bg-transparent font-bold text-sm text-[#1a1c1e] focus:outline-none cursor-pointer pr-2 py-1.5"
                >
                  <option value="name_asc">Nombre (A - Z)</option>
                  <option value="price_desc">Precio: Más alto a bajo</option>
                  <option value="price_asc">Precio: Más bajo a alto</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                  showFilters || selectedCategory
                    ? 'bg-[#014d4e] text-white shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined">tune</span>
                {selectedCategory ? `Categoría: ${selectedCategory}` : 'Categorías'}
                <span className={`material-symbols-outlined transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setCurrentPage(1)
                        setShowFilters(false)
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        selectedCategory === null 
                          ? 'bg-[#72c1c1] text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Ver todos
                    </button>
                    {CATALOG_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          setCurrentPage(1)
                          setShowFilters(false)
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                          selectedCategory === cat 
                            ? 'bg-[#72c1c1] text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barra de estado de resultados */}
          <div className="flex flex-wrap justify-between items-center mb-6 px-2 text-xs font-bold text-slate-500 gap-2">
            <span>
              {effectiveTotal > 0
                ? `Mostrando ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, effectiveTotal)} de ${effectiveTotal} productos`
                : '0 productos encontrados'}
            </span>
            {(selectedCategory || debouncedSearch || sortOrder !== 'name_asc') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setDebouncedSearch('')
                  setSelectedCategory(null)
                  setSortOrder('name_asc')
                  setCurrentPage(1)
                }}
                className="text-[#014d4e] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Restablecer filtros
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 h-80 animate-pulse flex flex-col justify-between">
                  <div className="w-16 h-5 bg-slate-100 rounded-full" />
                  <div className="w-32 h-32 bg-slate-100 rounded-2xl mx-auto" />
                  <div>
                    <div className="w-24 h-3 bg-slate-100 rounded mb-2" />
                    <div className="w-full h-5 bg-slate-100 rounded mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="w-20 h-7 bg-slate-100 rounded" />
                      <div className="w-11 h-11 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
              <p className="font-semibold text-lg">No hay productos disponibles para esa búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {displayedProducts.map(product => {
                  const isJustAdded = addedId === product.id
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white border border-slate-100 rounded-3xl md:rounded-4xl p-5 md:p-8 group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden"
                    >
                      <span className="self-start bg-[#014d4e]/10 text-[#014d4e] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                        {product.code}
                      </span>
                      <div className="flex-1 flex items-center justify-center py-8">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={200}
                            height={200}
                            sizes="(max-width: 768px) 45vw, 200px"
                            className="h-48 w-auto object-cover rounded-xl group-hover:scale-105 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-all duration-500">
                            <span className="material-symbols-outlined text-4xl mb-2">medication</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F0A17E] block mb-1">
                          {product.category}
                        </span>
                        <h3 className="font-headline font-bold text-lg text-[#1a1c1e] mb-4 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="font-headline font-black text-2xl text-[#014d4e]">
                            S/ {product.price.toFixed(2)}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            aria-label={`Agregar ${product.name} al carrito`}
                            className={`${
                              isJustAdded ? 'bg-emerald-600 scale-110' : 'bg-[#014d4e] hover:bg-[#F0A17E]'
                            } text-white p-3 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center`}
                          >
                            <span className="material-symbols-outlined">
                              {isJustAdded ? 'check' : 'add_shopping_cart'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Controles de Paginación */}
              {effectiveTotalPages > 1 && (
                <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                    Anterior
                  </button>

                  {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === effectiveTotalPages ||
                      Math.abs(page - currentPage) <= 2
                    )
                    .reduce<(number | string)[]>((acc, page, idx, arr) => {
                      if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                        acc.push('...')
                      }
                      acc.push(page)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item as number)}
                          className={`w-10 h-10 rounded-2xl font-bold text-sm transition-all ${
                            currentPage === item
                              ? 'bg-[#014d4e] text-white shadow-md scale-105'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === effectiveTotalPages}
                    className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
                  >
                    Siguiente
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal de Vista Rápida del Producto */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-4xl p-6 md:p-10 max-w-2xl w-full shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 relative"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                aria-label="Cerrar detalle"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="bg-[#f8fafa] rounded-3xl p-8 flex items-center justify-center">
                {selectedProduct.imageUrl ? (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width={260}
                    height={260}
                    className="h-56 w-auto object-contain rounded-2xl"
                  />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-slate-300">medication</span>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#014d4e]/10 text-[#014d4e] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {selectedProduct.code}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F0A17E]">
                      {selectedProduct.category}
                    </span>
                  </div>
                  <h2 className="font-headline font-black text-2xl text-[#1a1c1e] mb-3 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {selectedProduct.description ||
                      'Fórmula dermatológica magistral de grado clínico evaluada por especialistas de DERMQ. Incluye IGV.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs font-bold uppercase text-slate-400">Precio (IGV incl.)</span>
                    <span className="font-headline font-black text-3xl text-[#014d4e]">
                      S/ {selectedProduct.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                    className="w-full bg-[#014d4e] hover:bg-[#F0A17E] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

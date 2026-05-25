'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS_DATA, type Product } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { getProducts } from '@/lib/api'

// Helper dynamically mapping category based on name for catalog filter uniformity
function getProductCategory(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('retinoico')) return 'Renovadores Celulares';
  if (lowercaseName.includes('benzoilo') || lowercaseName.includes('acné')) return 'Anti-Acné';
  if (lowercaseName.includes('hidroquinona') || lowercaseName.includes('despigmentante')) return 'Despigmentantes';
  if (lowercaseName.includes('láctico') || lowercaseName.includes('salicílico') || lowercaseName.includes('urea')) return 'Queratolíticos';
  if (lowercaseName.includes('clobetasol') || lowercaseName.includes('triamcinolona')) return 'Corticoides';
  if (lowercaseName.includes('aluminio')) return 'Astringentes';
  if (lowercaseName.includes('eritromicina')) return 'Antibióticos';
  if (lowercaseName.includes('econazol')) return 'Antimicóticos';
  if (lowercaseName.includes('minoxidil')) return 'Tratamiento Capilar';
  if (lowercaseName.includes('anestesia') || lowercaseName.includes('lidocaina')) return 'Anestésicos';
  return 'Cuidado Dermatológico'; // Categoria default
}

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()
  
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        const data = await getProducts()
        if (data && data.length > 0) {
          const mappedProducts = data.map((p: any) => ({
            id: p.id,
            code: p.sku || p.code || 'MOCK',
            name: p.name,
            category: p.category || getProductCategory(p.name),
            price: Number(p.price) || 90.00,
            imageUrl: p.imageUrl || '/product_tube.png'
          }))
          setProductsList(mappedProducts)
        }
      } catch (err) {
        console.error('Error fetching products from API, falling back to static mocks:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const categories = Array.from(new Set(productsList.map(p => p.category)));

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="pt-0">
      <section className="pt-8 pb-24 bg-[#f8fafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#014d4e]/10 border border-[#014d4e]/20 text-[#014d4e] text-xs font-bold uppercase tracking-widest mb-6">
                DERMQ Shop
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-[#1a1c1e] leading-[1.05]">
                Cuida tu piel,{' '}
                <span className="text-[#F0A17E] italic">cada día.</span>
              </h1>
            </div>
            <p className="text-on-surface-variant font-medium max-w-sm">
              Selección dermatológica de grado clínico formulada y recomendada por nuestros especialistas.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 lg:p-6 rounded-3xl shadow-sm border border-slate-100 mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Buscar producto o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#72c1c1] transition-all"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
                  showFilters || selectedCategory
                    ? 'bg-[#014d4e] text-white shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined">tune</span>
                {selectedCategory ? `Categoría: ${selectedCategory}` : 'Filtrar por categoría'}
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
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
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

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-4">inventory_2</span>
              <p className="font-semibold text-lg">No hay productos disponibles para esa búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white border border-slate-100 rounded-4xl p-8 group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden">
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
                        onClick={() => addToCart(product)}
                        className="bg-[#014d4e] text-white p-3 rounded-full hover:bg-[#F0A17E] transition-colors hover:scale-110 active:scale-95 shadow-lg"
                      >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

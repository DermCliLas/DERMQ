'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { getProducts, createProduct, updateProduct, deleteProduct, updateProductStock, uploadFile } from '@/lib/api'

const getFamilyLabel = (fam: string) => {
  const map: Record<string, string> = {
    MP: 'Materia Prima',
    PI: 'Prod. Intermedio',
    ME: 'Mat. Envasado',
    PT: 'Prod. Terminado'
  }
  return map[fam] || fam
}

const getFamilyColor = (fam: string) => {
  const map: Record<string, string> = {
    MP: 'bg-purple-100 text-purple-800',
    PI: 'bg-blue-100 text-blue-800',
    ME: 'bg-orange-100 text-orange-800',
    PT: 'bg-emerald-100 text-emerald-800'
  }
  return map[fam] || 'bg-slate-100 text-slate-800'
}

export default function AdminProductsPage() {
  const { user, isAuthenticated } = useAuth()
  
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal de Agregar/Editar
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  
  // Campos del Formulario
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [family, setFamily] = useState('')
  const [lotNumber, setLotNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await uploadFile(file)
      setImageUrl(res.url)
    } catch (err: any) {
      alert('Error al subir la imagen a Supabase: ' + (err.message || 'Error del servidor'))
    } finally {
      setUploadingImage(false)
    }
  }


  const loadProducts = async () => {
    setLoading(true)
    try {
      const p = await getProducts()
      setProducts(p || [])
    } catch (e) {
      console.error('Error loading products for admin', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (!isAuthenticated) return null
  if (user?.role !== 'ADMIN') {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-[#F2F4F4] flex flex-col items-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_maybe</span>
        <h2 className="font-headline font-bold text-2xl text-[#1a1c1e] mb-2">Acceso Restringido</h2>
        <p className="text-slate-500 text-sm">No tienes permisos para ver esta sección.</p>
        <Link href="/dashboard" className="mt-6 text-primary font-bold hover:underline">Volver a mi panel</Link>
      </main>
    )
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setSku('')
    setName('')
    setDescription('')
    setPrice(0)
    setStock(0)
    setImageUrl('')
    setIsActive(true)
    setFamily('')
    setLotNumber('')
    setExpirationDate('')
    setIsModalOpen(true)
  }

  const openEditModal = (p: any) => {
    setEditingProduct(p)
    setSku(p.sku)
    setName(p.name)
    setDescription(p.description || '')
    setPrice(p.price)
    setStock(p.stock)
    setImageUrl(p.imageUrl || '')
    setIsActive(p.isActive)
    setFamily(p.family || '')
    setLotNumber(p.lotNumber || '')
    setExpirationDate(p.expirationDate ? p.expirationDate.split('T')[0] : '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sku.trim() || !name.trim() || price <= 0 || stock < 0) {
      alert('Por favor complete todos los datos requeridos de forma correcta.')
      return
    }

    setSaving(true)
    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl.trim() || null,
      isActive,
      family: family || null,
      lotNumber: lotNumber.trim() || null,
      expirationDate: expirationDate || null,
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
        alert('Producto actualizado correctamente.')
      } else {
        await createProduct(payload)
        alert('Producto creado correctamente.')
      }
      setIsModalOpen(false)
      loadProducts()
    } catch (err: any) {
      alert('Error al guardar el producto: ' + (err.message || 'Error del servidor'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${productName}"?\n\nEsta acción no se puede deshacer.`)) {
      return
    }
    try {
      await deleteProduct(id)
      alert('Producto eliminado correctamente.')
      loadProducts()
    } catch (err: any) {
      alert('Error al eliminar: ' + (err.message || 'Error del servidor'))
    }
  }

  const handleQuickStockAdjust = async (id: string, qty: number, operation: 'add' | 'subtract') => {
    try {
      await updateProductStock(id, qty, operation)
      // Actualización reactiva rápida local en el estado para evitar spinner completo
      setProducts(prev => 
        prev.map(p => {
          if (p.id === id) {
            const newStock = operation === 'add' ? p.stock + qty : Math.max(0, p.stock - qty)
            return { ...p, stock: newStock }
          }
          return p
        })
      )
    } catch (err: any) {
      alert('Error al ajustar stock: ' + (err.message || 'Error del servidor'))
    }
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Módulo Catálogo</p>
              <h1 className="font-headline font-black text-4xl tracking-tighter text-[#1a1c1e]">Gestionar Productos</h1>
            </div>
          </div>
          
          <button 
            onClick={openAddModal}
            className="luminous-gradient text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_20px_rgba(2,105,106,0.2)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Agregar Nuevo Producto
          </button>
        </div>

        {/* Listado */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <span className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-500">Cargando catálogo...</p>
          </div>
        ) : (
          <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400 pb-4">
                    <th className="pb-4">Vista</th>
                    <th className="pb-4">SKU / Código</th>
                    <th className="pb-4">Nombre de Producto</th>
                    <th className="pb-4">Detalles ERP</th>
                    <th className="pb-4">Precio (S/)</th>
                    <th className="pb-4 text-center">Stock</th>
                    <th className="pb-4 text-center">Estado</th>
                    <th className="pb-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 italic">No hay productos creados en la clínica.</td>
                    </tr>
                  ) : (
                    products.map(p => {
                      const isLowStock = p.stock <= 3
                      return (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          
                          {/* Vista Previa de Imagen */}
                          <td className="py-4">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                              {p.imageUrl ? (
                                <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-slate-300 text-lg">image</span>
                              )}
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-4 text-xs font-mono font-bold text-[#1a1c1e]">
                            {p.sku}
                          </td>

                          {/* Nombre y Descripción */}
                          <td className="py-4 text-xs max-w-xs">
                            <p className="font-bold text-[#1a1c1e] truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.description || 'Sin descripción'}</p>
                          </td>

                          {/* Detalles ERP */}
                          <td className="py-4 text-xs">
                            {p.family && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1.5 ${getFamilyColor(p.family)}`}>
                                {getFamilyLabel(p.family)}
                              </span>
                            )}
                            {p.lotNumber && (
                              <p className="font-bold text-[#1a1c1e] text-[10px]">Lote: {p.lotNumber}</p>
                            )}
                            {p.expirationDate && (
                              <p className={`text-[10px] mt-0.5 ${
                                new Date(p.expirationDate).getTime() < Date.now() 
                                  ? 'text-red-600 font-bold' 
                                  : new Date(p.expirationDate).getTime() < Date.now() + 90 * 24 * 60 * 60 * 1000 
                                    ? 'text-amber-600 font-bold' 
                                    : 'text-slate-400'
                              }`}>
                                Vence: {new Date(p.expirationDate).toLocaleDateString()}
                              </p>
                            )}
                          </td>

                          {/* Precio */}
                          <td className="py-4 text-xs font-headline font-black text-secondary">
                            S/ {p.price.toFixed(2)}
                          </td>

                          {/* Stock e incrementadores rápidos */}
                          <td className="py-4 text-center">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <span className={`text-sm font-headline font-black px-2.5 py-0.5 rounded-full ${
                                p.stock === 0 
                                  ? 'bg-red-100 text-red-700 animate-pulse' 
                                  : isLowStock 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-slate-100 text-slate-700'
                              }`}>
                                {p.stock} uds.
                              </span>
                              
                              {/* Ajustador de stock rápido */}
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleQuickStockAdjust(p.id, 1, 'subtract')}
                                  className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-200 text-[#1a1c1e]"
                                  title="Disminuir en 1 unidad"
                                >
                                  -
                                </button>
                                <button 
                                  onClick={() => handleQuickStockAdjust(p.id, 1, 'add')}
                                  className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-200 text-[#1a1c1e]"
                                  title="Aumentar en 1 unidad"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Estado Activo */}
                          <td className="py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {p.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          {/* Botones de acción */}
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => openEditModal(p)}
                                className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#1a1c1e] transition-colors"
                                title="Editar producto"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(p.id, p.name)}
                                className="p-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 transition-colors"
                                title="Eliminar producto"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </td>

                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Formulario Agregar / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-4xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto animate-scale-up"
          >
            <h3 className="font-headline font-black text-2xl text-[#1a1c1e] mb-6 pb-3 border-b border-slate-100">
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h3>

            <div className="space-y-4 mb-8">
              
              {/* SKU */}
              <div>
                <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">SKU / Código Único *</label>
                <input 
                  type="text"
                  required
                  placeholder="ej. PROD-10294"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Nombre del Producto *</label>
                <input 
                  type="text"
                  required
                  placeholder="ej. Crema Hidratante D-Laser"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Descripción</label>
                <textarea 
                  placeholder="Características del producto..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Fila: Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Precio Venta (S/) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    placeholder="S/ 0.00"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Stock Inicial *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    placeholder="Cantidad"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                    value={stock || ''}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Imagen del Producto */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1a1c1e] uppercase tracking-wider">Imagen del Producto</label>
                
                {imageUrl && (
                  <div className="relative w-32 h-32 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden group mb-3">
                    <img src={imageUrl} alt="Vista previa del producto" className="object-cover w-full h-full" />
                    <button 
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs rounded-2xl"
                    >
                      <span className="material-symbols-outlined text-lg mr-1">delete</span>
                      Quitar
                    </button>
                  </div>
                )}
                
                <div className="flex gap-4 items-center">
                  <label className="flex items-center justify-center gap-2 bg-[#1a1c1e] hover:bg-secondary text-white py-3 px-5 rounded-2xl font-bold cursor-pointer transition-all text-xs shadow-sm shrink-0">
                    {uploadingImage ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">upload_file</span>
                        Subir Foto
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="hidden" 
                    />
                  </label>
                  
                  {/* Campo de URL como texto (de respaldo) */}
                  <input 
                    type="text"
                    placeholder="O pega la URL de la imagen..."
                    className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e] text-xs"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>


              {/* Familia de Producto */}
              <div>
                <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Familia de Producto (ERP)</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e] font-bold text-sm"
                  value={family}
                  onChange={(e) => setFamily(e.target.value)}
                >
                  <option value="">Seleccione Familia...</option>
                  <option value="MP">Materia Prima (MP)</option>
                  <option value="PI">Producto Intermedio (PI)</option>
                  <option value="ME">Material de Envasado (ME)</option>
                  <option value="PT">Producto Terminado (PT)</option>
                </select>
              </div>

              {/* Lote y Vencimiento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Número de Lote</label>
                  <input 
                    type="text"
                    placeholder="ej. LT-928"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1e] mb-1.5 uppercase tracking-wider">Fecha de Vencimiento</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-[#1a1c1e]"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Checkbox Activo */}
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="is-active-checkbox"
                  className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary accent-primary cursor-pointer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label htmlFor="is-active-checkbox" className="text-sm font-bold text-[#1a1c1e] cursor-pointer">
                  Producto Activo (Visible en tienda y POS)
                </label>
              </div>

            </div>

            {/* Acciones */}
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 border-2 border-slate-200 hover:border-slate-300 font-bold rounded-2xl text-slate-500 transition-all text-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="flex-1 luminous-gradient text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Guardar Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

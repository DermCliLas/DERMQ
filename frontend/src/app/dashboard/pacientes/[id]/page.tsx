'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getMedicalHistory, createMedicalRecord, searchPatientByDni, uploadFile, getPatientProfile } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function PatientHistoryPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  
  const [patient, setPatient] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    clinicalNotes: '',
    physicalExam: '',
  })

  const [attachments, setAttachments] = useState<string[]>([])
  const [uploadingAttachments, setUploadingAttachments] = useState(false)

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingAttachments(true)
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const res = await uploadFile(files[i])
        urls.push(res.url)
      }
      setAttachments([...attachments, ...urls])
    } catch (err: any) {
      alert('Error al subir los archivos: ' + (err.message || 'Error del servidor'))
    } finally {
      setUploadingAttachments(false)
    }
  }

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== indexToRemove))
  }

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch history
        const historyData = await getMedicalHistory(id as string)
        setHistory(historyData)
        
        try {
          const profile = await getPatientProfile(id as string)
          setPatient(profile)
        } catch (profileErr) {
          console.error('Error fetching patient profile', profileErr)
        }
      } catch (e) {
        console.error('Error loading history', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createMedicalRecord({
        ...formData,
        patientId: id as string,
        attachments: attachments,
      })
      
      // Refresh history and close form
      const updatedHistory = await getMedicalHistory(id as string)
      setHistory(updatedHistory)
      setShowForm(false)
      setFormData({ diagnosis: '', treatment: '', clinicalNotes: '', physicalExam: '' })
      setAttachments([])
    } catch (err) {
      alert('Error al guardar el registro médico.')
    } finally {
      setSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center min-h-screen bg-[#F2F4F4]">
        <span className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 font-bold text-slate-500">Cargando historial clínico...</p>
      </div>
    )
  }

  return (
    <main className="pt-28 pb-24 bg-[#F2F4F4] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/dashboard/pacientes" className="text-primary font-bold text-sm flex items-center gap-2 mb-4 hover:translate-x-[-4px] transition-transform">
              <span className="material-symbols-outlined">arrow_back</span>
              Volver a Búsqueda
            </Link>
            <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1e]">
              Historia Clínica
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'bg-slate-200 text-slate-600' : 'luminous-gradient text-white'} px-10 py-5 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2`}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add_notes'}</span>
            {showForm ? 'Cancelar' : 'Nueva Evolución'}
          </button>
        </div>

        {/* Patient Premium Profile Card */}
        {patient && (
          <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-black shrink-0 overflow-hidden">
              {patient.avatarUrl ? (
                <img src={patient.avatarUrl} alt={patient.firstName} className="w-full h-full object-cover" />
              ) : (
                patient.firstName.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0 text-center md:text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-2 inline-block">
                Paciente Registrado
              </span>
              <h2 className="text-2xl font-headline font-black text-[#1a1c1e] truncate">
                {patient.firstName} {patient.lastName}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  DNI: {patient.dni || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {patient.email}
                </span>
                {patient.phone && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">call</span>
                    {patient.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Record Form */}
        {showForm && (
          <div className="bg-white rounded-4xl p-10 shadow-2xl border-2 border-primary/20 mb-12 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-headline font-black text-[#1a1c1e] mb-8 flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">edit_note</span>
               Registrar Nueva Evolución
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Diagnóstico</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 outline-none font-bold"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="Ej. Acné Quístico Grado II"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Examen Físico (Opcional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 outline-none font-bold"
                    value={formData.physicalExam}
                    onChange={(e) => setFormData({...formData, physicalExam: e.target.value})}
                    placeholder="Ej. Pápulas y pústulas en zona T"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Plan de Tratamiento</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 outline-none font-medium text-sm"
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                  placeholder="Medicamentos, dosis y periodo..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Notas Adicionales</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 outline-none font-medium text-sm"
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({...formData, clinicalNotes: e.target.value})}
                  placeholder="Detalles de la evolución clínica..."
                />
              </div>

              {/* Fotos Clínicas Adjuntas */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Fotos Clínicas Adjuntas</label>
                
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {attachments.map((url, index) => (
                      <div key={index} className="relative aspect-square bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden group">
                        <img src={url} alt={`Adjunto ${index + 1}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50/50 rounded-2xl p-6 cursor-pointer text-slate-500 hover:text-primary transition-all font-bold text-sm">
                  {uploadingAttachments ? (
                    <>
                      <span className="w-5 h-5 border-2 border-slate-400 border-t-primary rounded-full animate-spin" />
                      Subiendo archivos a Supabase...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">add_a_photo</span>
                      Adjuntar Imágenes Clínicas
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAttachmentUpload}
                    disabled={uploadingAttachments}
                    className="hidden"
                  />
                </label>
              </div>


              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                >
                  {submitting ? 'Guardando...' : 'Guardar Evolución'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-8">
          {history.length === 0 ? (
            <div className="bg-white rounded-4xl p-20 text-center border-2 border-dashed border-slate-200">
               <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">history_edu</span>
               <p className="text-on-surface-variant font-bold text-lg">Este paciente no tiene registros clínicos previos.</p>
               <button onClick={() => setShowForm(true)} className="text-primary font-black mt-4 hover:underline">Iniciar Historia Clínica</button>
            </div>
          ) : (
            history.map((record, idx) => (
              <div key={record.id} className="relative pl-8 md:pl-12">
                {/* Timeline Line */}
                {idx !== history.length - 1 && (
                  <div className="absolute left-[15px] md:left-[19px] top-10 bottom-[-40px] w-1 bg-slate-200" />
                )}
                
                {/* Timeline Dot */}
                <div className="absolute left-0 top-6 w-10 h-10 rounded-full bg-white border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-lg">medical_information</span>
                </div>

                <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
                        Evolución Clínica
                      </span>
                      <h3 className="text-2xl font-headline font-black text-[#1a1c1e]">
                        {record.diagnosis}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#1a1c1e] text-sm">{new Date(record.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-xs text-on-surface-variant font-medium">Por: {record.doctor.firstName} {record.doctor.lastName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plan de Tratamiento</h4>
                      <p className="text-sm font-bold text-[#1a1c1e] leading-relaxed whitespace-pre-line">
                        {record.treatment}
                      </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Examen Físico</h4>
                      <p className="text-sm font-bold text-[#1a1c1e] leading-relaxed italic">
                        {record.physicalExam || 'No reportado.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Notas Clínicas</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                      {record.clinicalNotes}
                    </p>
                  </div>

                  {/* Renderizar Fotos Clínicas de la Evolución */}
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Fotos Clínicas Adjuntas</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {record.attachments.map((url: string, index: number) => (
                          <a 
                            key={index} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="relative aspect-square bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md block group"
                          >
                            <img src={url} alt={`Anexo ${index + 1}`} className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                              <span className="material-symbols-outlined text-sm mr-1">open_in_new</span>
                              Ver original
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

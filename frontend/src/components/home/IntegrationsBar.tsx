'use client'

import { useEffect, useState } from 'react'
import { getSiteContent } from '@/lib/api'

interface IntegrationItem {
  icon: string
  label: string
}

interface IntegrationsContent {
  items: IntegrationItem[]
}

const DEFAULTS: IntegrationsContent = {
  items: [
    { icon: 'calendar_today', label: 'Google Calendar' },
    { icon: 'chat_bubble', label: 'WhatsApp Support' },
    { icon: 'credit_score', label: 'Safe Payments' },
    { icon: 'mail_outline', label: 'Email Reports' },
  ],
}

export default function IntegrationsBar() {
  const [content, setContent] = useState<IntegrationsContent>(DEFAULTS)

  useEffect(() => {
    getSiteContent('integrations')
      .then((data) => {
        if (data?.data && Array.isArray(data.data.items)) {
          setContent(data.data as IntegrationsContent)
        }
      })
      .catch((err) => console.error('Error fetching Integraciones content:', err))
  }, [])

  return (
    <section className="py-24 bg-[#F0A17E]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-around gap-12 text-white opacity-90 hover:opacity-100 transition-all duration-700">
          {content.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 hover:-translate-y-2 hover:scale-110 hover:drop-shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl">{item.icon}</span>
              <span className="font-headline font-bold text-lg tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

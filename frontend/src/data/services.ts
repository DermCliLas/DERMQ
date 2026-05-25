export interface ServiceDetail {
  name: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  imageUrl4: string;
  services: ServiceDetail[];
}

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'dermatologia-clinica',
    name: 'Dermatología Clínica y Quirúrgica',
    description: 'Diagnóstico y tratamiento experto de afecciones de la piel, pelo y uñas, incluyendo procedimientos quirúrgicos ambulatorios de alta precisión bajo el rigor de la Dra. Marcela Leyva.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
    imageUrl2: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    imageUrl3: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200',
    imageUrl4: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200',
    services: [
      { name: "Consulta médica especializada", description: "Evaluación clínica exhaustiva para el diagnóstico preciso de patologías dermatológicas." },
      { name: "Destrucción de lesiones (Radiofrecuencia)", description: "Eliminación de verrugas y lesiones mediante tecnología de radiofrecuencia y crioterapia." },
      { name: "Biopsias de piel", description: "Toma de muestras cutáneas para estudio histopatológico y diagnóstico definitivo." },
      { name: "Cirugías ambulatorias", description: "Extracción segura de quistes, lipomas y otras lesiones con mínima cicatrización." },
      { name: "Retiro de lunares", description: "Procedimientos estéticos y preventivos para la eliminación controlada de nevus." },
      { name: "Tratamiento de queloides", description: "Manejo avanzado de cicatrices hipertróficas con criocirugía e infiltraciones." },
      { name: "Manejo de onicomicosis", description: "Tratamiento clínico integral para la eliminación persistente de hongos en las uñas." }
    ]
  },
  {
    id: 'laser-avanzado',
    name: 'Láser de Vanguardia',
    description: 'Tecnología lumínica de última generación para la corrección de cicatrices, manchas, enrojecimiento y rejuvenecimiento profundo de la piel.',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200',
    imageUrl2: 'https://images.unsplash.com/photo-1628178144541-0739e4bd1f8b?auto=format&fit=crop&q=80&w=1200',
    imageUrl3: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&q=80&w=1200',
    imageUrl4: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=1200',
    services: [
      { name: "Láser para cicatrices", description: "Mejoría notable de cicatrices de acné o quirúrgicas en rostro y cuerpo." },
      { name: "Láser para enrojecimiento facial", description: "Tratamiento de rosácea y telangiectasias (arañitas vasculares) con precisión térmica." },
      { name: "Láser para daño solar", description: "Restauración de la piel foto-dañada por la exposición UV prolongada." },
      { name: "Rejuvenecimiento facial láser", description: "Atenuación de signos de envejecimiento y mejora global de la textura cutánea." },
      { name: "Láser para manchas oscuras", description: "Eliminación de léntigos solares y pigmentaciones irregulares con tecnología Q-Switched o similares." },
      { name: "Tratamiento de estrías con láser", description: "Estimulación de colágeno para reducir la apariencia de estrías nuevas y antiguas." },
      { name: "Retiro de tatuajes", description: "Fragmentación segura de pigmentos de tatuajes mediante pulsos láser de alta potencia." },
      { name: "Tratamiento de onicomicosis láser", description: "Eliminación de hongos en las uñas mediante calor controlado, sin medicación oral." }
    ]
  },
  {
    id: 'estetica-inyectables',
    name: 'Estética & Rejuvenecimiento',
    description: 'Tratamientos inyectables y técnicas mínimamente invasivas para restaurar volúmenes, suavizar arrugas y revitalizar la calidad de la piel.',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1200',
    imageUrl2: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1200',
    imageUrl3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1200',
    imageUrl4: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200',
    services: [
      { name: "Toxina Botulínica (Arrugas)", description: "Suavización de líneas de expresión y corrección de asimetrías faciales dinámicas." },
      { name: "Toxina Botulínica (Sudoración)", description: "Bloqueo selectivo para el manejo de la sudoración excesiva (hiperhidrosis)." },
      { name: "Ácido Hialurónico (Modelado)", description: "Relleno y perfilado facial para restaurar volúmenes y mejorar la estructura del rostro." },
      { name: "Bioestimulación (Calidad de Piel)", description: "Mejora de la hidratación y elasticidad cutánea mediante inductores de colágeno." },
      { name: "Mesoterapia Médica", description: "Infiltración de principios activos de alta pureza para nutrir y revitalizar la dermis." }
    ]
  }
];

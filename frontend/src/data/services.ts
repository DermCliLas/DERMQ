import { DRA_LEYVA_PHOTOS } from './draleyva-photos';

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
    imageUrl: DRA_LEYVA_PHOTOS.directoraDermatoscope,
    imageUrl2: DRA_LEYVA_PHOTOS.directoraDeskWorking,
    imageUrl3: DRA_LEYVA_PHOTOS.directoraSkinEvaluation,
    imageUrl4: DRA_LEYVA_PHOTOS.directoraPrescription,
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
    imageUrl: DRA_LEYVA_PHOTOS.laserQuantaSystem,
    imageUrl2: DRA_LEYVA_PHOTOS.laserFotona,
    imageUrl3: DRA_LEYVA_PHOTOS.laserDiodeOperating,
    imageUrl4: DRA_LEYVA_PHOTOS.laserDiodeSmile,
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
    imageUrl: DRA_LEYVA_PHOTOS.iplAestheticMachine,
    imageUrl2: DRA_LEYVA_PHOTOS.bodyContouringOperating,
    imageUrl3: DRA_LEYVA_PHOTOS.bodyContouringDevice,
    imageUrl4: DRA_LEYVA_PHOTOS.directoraWindowCloseUp,
    services: [
      { name: "Toxina Botulínica (Arrugas)", description: "Suavización de líneas de expresión y corrección de asimetrías faciales dinámicas." },
      { name: "Toxina Botulínica (Sudoración)", description: "Bloqueo selectivo para el manejo de la sudoración excesiva (hiperhidrosis)." },
      { name: "Ácido Hialurónico (Modelado)", description: "Relleno y perfilado facial para restaurar volúmenes y mejorar la estructura del rostro." },
      { name: "Bioestimulación (Calidad de Piel)", description: "Mejora de la hidratación y elasticidad cutánea mediante inductores de colágeno." },
      { name: "Mesoterapia Médica", description: "Infiltración de principios activos de alta pureza para nutrir y revitalizar la dermis." }
    ]
  }
];

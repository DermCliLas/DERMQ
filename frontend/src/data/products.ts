export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export const PRODUCTS_DATA: Product[] = [
  { id: 'dcl-1', code: 'GALDERMA', name: 'GALDERMA CETAPHIL BARRA LIMPIADORA', category: 'Limpieza Facial', price: 80.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-2', code: 'GALDERMA', name: 'GALDERMA CETAPHIL LOCIÓN LIMPIADORA PIEL SENSIBLE 473ML', category: 'Limpieza Facial', price: 130.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-3', code: 'GALDERMA', name: 'GALDERMA CETAPHIL LIMPIADOR PIEL GRASA 237ML', category: 'Limpieza Facial', price: 100.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-4', code: 'GALDERMA', name: 'GALDERMA CETAPHIL PRO-AC CONTROL ESPUMA', category: 'Limpieza Facial', price: 130.00, imageUrl: '/product_hair.png' },
  { id: 'dcl-5', code: 'GALDERMA', name: 'GALDERMA CETAPHIL LOCION HUMECTANTE', category: 'Hidratación & Cuidado', price: 140.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-6', code: 'GALDERMA', name: 'GALDERMA CETAPHIL CREMA HIDRATANTE POTE 453GR', category: 'Hidratación & Cuidado', price: 120.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-7', code: 'GALDERMA', name: 'GALDERMA CETAPHIL OPTIMAL HYDRATION SERUM FACIAL', category: 'Serums & Tratamiento Específico', price: 190.00, imageUrl: '/product_serum.png' },
  { id: 'dcl-8', code: 'ISDIN', name: 'ISDIN FOTOPROTECTOR FUSION WATER MAGIC SPF50', category: 'Fotoprotección Solar', price: 140.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-9', code: 'ISDIN', name: 'ISDIN NUTRATOPIC PRO-AMP CREMA FACIAL 50ML', category: 'Hidratación & Cuidado', price: 90.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-10', code: 'ISDIN', name: 'ISDIN NUTRADEICA GEL CREMA FACIAL DS', category: 'Hidratación & Cuidado', price: 120.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-11', code: 'URIAGE', name: 'URIAGE EAU THERMALE SPRAY 300ML', category: 'Limpieza Facial', price: 100.00, imageUrl: '/product_hair.png' },
  { id: 'dcl-12', code: 'URIAGE', name: 'URIAGE ROSELIANE CREMA SPF30 ANTIROJECES', category: 'Hidratación & Cuidado', price: 100.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-13', code: 'URIAGE', name: 'URIAGE BARIÉDERM-CICA CREMA DE MANOS 50ML', category: 'Hidratación & Cuidado', price: 60.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-14', code: 'SIEGFRIED', name: 'SIEGFRIED ROACCUTAN 20MG X 30 COMPRIMIDOS', category: 'Serums & Tratamiento Específico', price: 220.00, imageUrl: '/product_capsules.png' },
  { id: 'dcl-15', code: 'CANTABRIA', name: 'CANTABRIA HELIOCARE OIL FREE COMPACT COLOR BROWN SPF50+', category: 'Fotoprotección Solar', price: 130.00, imageUrl: '/product_tube.png' },
  { id: 'dcl-16', code: 'GENOVE', name: 'GENOVE PILOPEPTAN WOMAN SERUM POTENCIADOR DE PESTAÑAS Y CEJAS', category: 'Serums & Tratamiento Específico', price: 220.00, imageUrl: '/product_serum.png' }
];

export const getFeaturedProducts = () => {
  return PRODUCTS_DATA.slice(0, 4);
};

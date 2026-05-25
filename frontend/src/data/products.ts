export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export const PRODUCTS_DATA: Product[] = [
  { id: '1', code: 'AAR1', name: 'ACIDO RETINOICO 0.025% CREMA X 30 GR', category: 'Renovadores Celulares', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '2', code: 'AAR2', name: 'ACIDO RETINOICO 0.05% CREMA X 30 GR', category: 'Renovadores Celulares', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '3', code: 'AAR3', name: 'ACIDO RETINOICO 0.1% CREMA X 30 GR', category: 'Renovadores Celulares', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '4', code: 'AAR4', name: 'PEROXIDO BENZOILO 5% GEL X 30 GR', category: 'Anti-Acné', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '5', code: 'AAR9', name: 'METRONIDAZOL 1% FLUOCINONIDA 0.01% GEL X 30 GR', category: 'Rosácea', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '6', code: 'DES-3', name: 'HIDROQUINONA 3% CREMA X 30 GR', category: 'Despigmentantes', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '7', code: 'DES-6', name: 'HIDROQUINONA 6% A.RETINOICO 0.025% FLUOCINONIDA 0.01% CREMA X 30 GR', category: 'Despigmentantes', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '8', code: 'QUE-1', name: 'ACIDO LACTICO 17% ACIDO SALICILICO 17% COLODION FLEXIBLE 13 ML', category: 'Queratolíticos', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '9', code: 'QUE-3', name: 'UREA 10% SALICILICO 3% RETINOICO 0.05% TRIAMC 0.025% CREMA X 30 GR', category: 'Queratolíticos', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '10', code: 'QUE-6', name: 'UREA 40% BIFONAZOL 1% UNGÜENTO X 20 GR', category: 'Antimicóticos y Queratolíticos', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '11', code: 'COR-7', name: 'CLOBETASOL 0.05% UREA 10% ACIDO SALICILICO 4% UNGÜENTO X 50 GR', category: 'Corticoides', price: 100.00, imageUrl: '/product_tube.png' },
  { id: '12', code: 'COR-8', name: 'CLOBETASOL 0.05% ACIDO SALICILICO 2% LOCION FCO GOTERO X 30 ML', category: 'Corticoides', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '13', code: 'COR-11', name: 'TRIAMCINOLONA 0.025% UREA 20% SALICILICO 5% UNGÜENTO X 50 GR', category: 'Corticoides', price: 100.00, imageUrl: '/product_tube.png' },
  { id: '14', code: 'COR-12', name: 'TRIAMCINOLONA 0.025% ACIDO SALICILICO 2% LOCIÓN X 30 ML FCO GOTERO', category: 'Corticoides', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '15', code: 'AST-1', name: 'SUBACETATO ALUMINIO 5.45% SOLUCION X 120 ML', category: 'Astringentes', price: 50.00, imageUrl: '/product_serum.png' },
  { id: '16', code: 'AST-2', name: 'CLORURO ALUMINIO 20% SOLUCION OH X 100 ML', category: 'Antitranspirantes', price: 80.00, imageUrl: '/product_serum.png' },
  { id: '17', code: 'ERI-2', name: 'ERITROMICINA 2% AZUFRE 1% HIDROCORTISONA 1% CREMA 20 GR', category: 'Antibióticos', price: 90.00, imageUrl: '/product_tube.png' },
  { id: '18', code: 'APR-3', name: 'ALCANFOR 0.5% MENTOL 0.5% BETAMETASONA 0.01% LOCION X 100 ML', category: 'Antipruriginosos', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '19', code: 'MIC-1', name: 'ECONAZOLI 1% TALCO CSP 100 GR FRASCO TALQUERA', category: 'Antimicóticos', price: 100.00, imageUrl: '/product_serum.png' },
  { id: '20', code: 'MIN-5', name: 'MINOXIDIL 5% ESPUMA FCO X 100 ML', category: 'Tratamiento Capilar', price: 100.00, imageUrl: '/product_hair.png' },
  { id: '21', code: 'PIG-2', name: 'ESENCIA BERGAMOTA 30% SOLUCION 30 ML', category: 'Esencias', price: 90.00, imageUrl: '/product_serum.png' },
  { id: '22', code: 'ATX', name: 'ACIDO TRAMEXAMICO 250 MG FCO 30 CAPSULAS', category: 'Despigmentantes Sistémicos', price: 130.00, imageUrl: '/product_capsules.png' },
  { id: '23', code: 'ANESTECIA', name: 'PRILOCAINA 7% TETRACAINA 5% LIDOCAINA 7% CREMA CPS 250 GR', category: 'Anestésicos', price: 150.00, imageUrl: '/product_jar.png' }
];

export const getFeaturedProducts = () => {
  return PRODUCTS_DATA.filter(p => ['AAR1', 'DES-3', 'COR-7', 'MIN-5'].includes(p.code));
};

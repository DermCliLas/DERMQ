export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    "id": "dcl-1",
    "code": "CETAPHIL BARRA LIMPIADORA",
    "name": "CETAPHIL BARRA LIMPIADORA GALDERMA",
    "category": "Limpieza Facial",
    "price": 80,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-2",
    "code": "CETAPHIL LOCIÓN LIMPIADORA PIEL SENSIBLE 473",
    "name": "CETAPHIL LOCIÓN LIMPIADORA PIEL SENSIBLE 473 GALDERMA",
    "category": "Limpieza Facial",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-3",
    "code": "CETAPHIL LIMPIADOR PIEL GRASA   237 ML",
    "name": "CETAPHIL LIMPIADOR PIEL GRASA   237 ML GALDERMA",
    "category": "Limpieza Facial",
    "price": 100,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-4",
    "code": "CETAPHIL PRO-AC CONTROL ESPUMA",
    "name": "CETAPHIL PRO-AC CONTROL ESPUMA GALDERMA",
    "category": "Limpieza Facial",
    "price": 130,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-5",
    "code": "CETAPHIL LOCION HUMECTANTE",
    "name": "CETAPHIL LOCION HUMECTANTE GALDERMA",
    "category": "Hidratación & Cuidado",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-6",
    "code": "CETAPHIL CREMA HIDRATANTE   POTE   453gr",
    "name": "CETAPHIL CREMA HIDRATANTE   POTE   453gr GALDERMA",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-7",
    "code": "CETAPHIL OPTIMAL HYDRATION SERUM FACIAL",
    "name": "CETAPHIL OPTIMAL HYDRATION SERUM FACIAL GALDERMA",
    "category": "Serums & Tratamiento Específico",
    "price": 190,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-8",
    "code": "CETAPHIL OPTIMAL HYDRATION SERUM CONTORNO DE OJOS",
    "name": "CETAPHIL OPTIMAL HYDRATION SERUM CONTORNO DE OJOS GALDERMA",
    "category": "Serums & Tratamiento Específico",
    "price": 160,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-9",
    "code": "CLOB-X 0.05% SHAMPOO 125ML",
    "name": "CLOB-X 0.05% SHAMPOO 125ML GALDERMA",
    "category": "Limpieza Facial",
    "price": 170,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-10",
    "code": "ARCOLANE CHAMPU 2% (KETOCONAZOL 100ML)",
    "name": "ARCOLANE CHAMPU 2% (KETOCONAZOL 100ML) GALDERMA",
    "category": "Limpieza Facial",
    "price": 110,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-11",
    "code": "SOOLANTRA 1% CREMA IVERMECTINA",
    "name": "SOOLANTRA 1% CREMA IVERMECTINA GALDERMA",
    "category": "Hidratación & Cuidado",
    "price": 160,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-12",
    "code": "TETRALYSAL CAPSULAS",
    "name": "TETRALYSAL CAPSULAS GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_capsules.png"
  },
  {
    "id": "dcl-13",
    "code": "ORACEA DOXICICLINA 40 mg Capsula 28 Und",
    "name": "ORACEA DOXICICLINA 40 mg Capsula 28 Und GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 210,
    "imageUrl": "/product_capsules.png"
  },
  {
    "id": "dcl-14",
    "code": "EPIDUO  FORTE 0.3%/2.5% Gel",
    "name": "EPIDUO  FORTE 0.3%/2.5% Gel GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-15",
    "code": "EPIDUO 0.1%/2.5% Gel",
    "name": "EPIDUO 0.1%/2.5% Gel GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-16",
    "code": "TRILUMA",
    "name": "TRILUMA GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 210,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-17",
    "code": "LOCERYL 5% LACA PARA UÑAS 2.5 ML",
    "name": "LOCERYL 5% LACA PARA UÑAS 2.5 ML GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 220,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-18",
    "code": "DIFFERIN 0.3% GEL TOPICO - Tubo 45 G",
    "name": "DIFFERIN 0.3% GEL TOPICO - Tubo 45 G GALDERMA",
    "category": "Cuidado Dermatológico",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-19",
    "code": "ROACCUTAN 20mg x 30 CB",
    "name": "ROACCUTAN 20mg x 30 CB SIEGFRIED",
    "category": "Cuidado Dermatológico",
    "price": 220,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-20",
    "code": "NUTRATOPIC PRO-AMP CREMA FACIAL 50ML C/F",
    "name": "NUTRATOPIC PRO-AMP CREMA FACIAL 50ML C/F ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 90,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-21",
    "code": "NUTRATOPIC PRO-AMP LOCION EMOLIENTE",
    "name": "NUTRATOPIC PRO-AMP LOCION EMOLIENTE ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-22",
    "code": "NUTRATOPIC PRO-AMP GEL BAÑO",
    "name": "NUTRATOPIC PRO-AMP GEL BAÑO ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-23",
    "code": "NUTRADEICA GEL CREMA FACIAL DS",
    "name": "NUTRADEICA GEL CREMA FACIAL DS ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-24",
    "code": "NUTRADEICA CHAMPU ANTICASPA GRASA",
    "name": "NUTRADEICA CHAMPU ANTICASPA GRASA ISDIN",
    "category": "Limpieza Facial",
    "price": 120,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-25",
    "code": "TEEN SKIN ACNIBEN REPAIR HIDRATANTE FACIAL 40ml",
    "name": "TEEN SKIN ACNIBEN REPAIR HIDRATANTE FACIAL 40ml ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 110,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-26",
    "code": "TEEN SKIN ACNIBEN REPAIR BÁLSAMO LABIAL",
    "name": "TEEN SKIN ACNIBEN REPAIR BÁLSAMO LABIAL ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-27",
    "code": "FOTOPROTECTOR ISDIN LABIAL (LIPS STICK) FPS 50+ 4 GR",
    "name": "FOTOPROTECTOR ISDIN LABIAL (LIPS STICK) FPS 50+ 4 GR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-28",
    "code": "UREADIN CREMA ANTIARRUGAS - 50ML",
    "name": "UREADIN CREMA ANTIARRUGAS - 50ML ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-29",
    "code": "UREADIN OIL HIDRATANTE UREADIN  GEL PODOS 75ML",
    "name": "UREADIN OIL HIDRATANTE UREADIN  GEL PODOS 75ML ISDIN",
    "category": "Hidratación & Cuidado",
    "price": 90,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-30",
    "code": "AVENA GEL DE BAÑO 750ML CUERPO",
    "name": "AVENA GEL DE BAÑO 750ML CUERPO ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 80,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-31",
    "code": "FOTOPROTECTOR DRY TOUCH GEL CREAM 50+ X 50 ML",
    "name": "FOTOPROTECTOR DRY TOUCH GEL CREAM 50+ X 50 ML ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-32",
    "code": "FOTOPROTECTOR COMPACTO ARENA SPF50-10GR",
    "name": "FOTOPROTECTOR COMPACTO ARENA SPF50-10GR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-33",
    "code": "FOTOPROTECTOR COMPACTO BRONCE  SPF50-10GR",
    "name": "FOTOPROTECTOR COMPACTO BRONCE  SPF50-10GR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-34",
    "code": "FOTOPROTECTOR  FUSION WATER MAGIC",
    "name": "FOTOPROTECTOR  FUSION WATER MAGIC ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-35",
    "code": "FOTOPROTECTOR  FUSION WATER MAGIC REPAIR",
    "name": "FOTOPROTECTOR  FUSION WATER MAGIC REPAIR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-36",
    "code": "FOTOPROTECTOR  FUSION WATER MAGIC REPAIR   CON COLOR",
    "name": "FOTOPROTECTOR  FUSION WATER MAGIC REPAIR   CON COLOR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-37",
    "code": "FOTO ERYFOTONA AK-NMSC FLUID 50ML",
    "name": "FOTO ERYFOTONA AK-NMSC FLUID 50ML ISDIN",
    "category": "Fotoprotección Solar",
    "price": 120,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-38",
    "code": "FOTOPROTECTOR GEL SPORT 100 ml",
    "name": "FOTOPROTECTOR GEL SPORT 100 ml ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-39",
    "code": "FOTOPROTECTOR ISDIN GEL CREMA WET SKIN 50+ 250ML",
    "name": "FOTOPROTECTOR ISDIN GEL CREMA WET SKIN 50+ 250ML ISDIN",
    "category": "Fotoprotección Solar",
    "price": 160,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-40",
    "code": "FOTOPROTECTOR PEDIATRICS FUSION WATER SPF50",
    "name": "FOTOPROTECTOR PEDIATRICS FUSION WATER SPF50 ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-41",
    "code": "FOTOPROTECTOR  FUSION WATER  MAGIC PEDIATRICS SPF50",
    "name": "FOTOPROTECTOR  FUSION WATER  MAGIC PEDIATRICS SPF50 ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-42",
    "code": "FOTO ULTRA +100(despigmentante) ACTIVE UNIFY FUSION FLUID",
    "name": "FOTO ULTRA +100(despigmentante) ACTIVE UNIFY FUSION FLUID ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-43",
    "code": "FOTO ULTRA+100(despigmentante) ACTIVE UNIFY FUSION FLUID COLOR",
    "name": "FOTO ULTRA+100(despigmentante) ACTIVE UNIFY FUSION FLUID COLOR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-44",
    "code": "FOTOULTRA + 50 (triple accion)   AGE REPAIR FUSION WATER",
    "name": "FOTOULTRA + 50 (triple accion)   AGE REPAIR FUSION WATER ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-45",
    "code": "FOTOULTRA  + 50(triple accion)   AGE REPAIR FUSION WATER COLOR",
    "name": "FOTOULTRA  + 50(triple accion)   AGE REPAIR FUSION WATER COLOR ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-46",
    "code": "FOTOULTRA +100 (previene manchas solares) SPOT PREVENTV 50 ml",
    "name": "FOTOULTRA +100 (previene manchas solares) SPOT PREVENTV 50 ml ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-47",
    "code": "FOTOULTRA +100 (previene manchas solares) SPOT PREVENTV CON COLOR 50 ml",
    "name": "FOTOULTRA +100 (previene manchas solares) SPOT PREVENTV CON COLOR 50 ml ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-48",
    "code": "FOTOULTRA ISDIN REDNESS SPF 50:",
    "name": "FOTOULTRA ISDIN REDNESS SPF 50: ISDIN",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-49",
    "code": "ISDINCEUTICS KOX EYES CREAM BOLSAS Y OJERAS",
    "name": "ISDINCEUTICS KOX EYES CREAM BOLSAS Y OJERAS ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 210,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-50",
    "code": "ISDINCEUTICS HYALURONIC CONCENTRATE - 30ml",
    "name": "ISDINCEUTICS HYALURONIC CONCENTRATE - 30ml ISDIN",
    "category": "Serums & Tratamiento Específico",
    "price": 220,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-51",
    "code": "ISDINCEUTICS MELACLEAR ADVANCED 30ML",
    "name": "ISDINCEUTICS MELACLEAR ADVANCED 30ML ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 290,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-52",
    "code": "GLICOISDIN 8% SOFT GEL 50ML",
    "name": "GLICOISDIN 8% SOFT GEL 50ML ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 170,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-53",
    "code": "GLICOISDIN 15% GEL 50ML",
    "name": "GLICOISDIN 15% GEL 50ML ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 180,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-54",
    "code": "SI-NAILS VARNISH 2.5ML FORTALECEDOR UÑAS",
    "name": "SI-NAILS VARNISH 2.5ML FORTALECEDOR UÑAS ISDIN",
    "category": "Cuidado Dermatológico",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-55",
    "code": "EAU THERMALE URIAGE SPRAY 300ML",
    "name": "EAU THERMALE URIAGE SPRAY 300ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 100,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-56",
    "code": "EAU THERMALE URIAGE SPRAY  150ML",
    "name": "EAU THERMALE URIAGE SPRAY  150ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 70,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-57",
    "code": "EAU THERMALE URIAGE SPRAY   50ML",
    "name": "EAU THERMALE URIAGE SPRAY   50ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 40,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-58",
    "code": "EAU THERMALE DESMAQUILLANTE DE OJOS BIFÁSICO 100ML",
    "name": "EAU THERMALE DESMAQUILLANTE DE OJOS BIFÁSICO 100ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-59",
    "code": "EAU THERMALE GEL DESMAQUILLANTE FACIAL DERMATOLOGICO 150ML",
    "name": "EAU THERMALE GEL DESMAQUILLANTE FACIAL DERMATOLOGICO 150ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 80,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-60",
    "code": "EAU THERMALE  D.S HAIR CHAMPU EQUILIBRANTE | 200 ML  (NUEVO PRODUCTO)",
    "name": "EAU THERMALE  D.S HAIR CHAMPU EQUILIBRANTE | 200 ML  (NUEVO PRODUCTO) URIAGE",
    "category": "Limpieza Facial",
    "price": 80,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-61",
    "code": "EAU THERMALE  AGE LIFT SERUM INTENSIVO  30Ml  (PRODUCTO NUEVO)",
    "name": "EAU THERMALE  AGE LIFT SERUM INTENSIVO  30Ml  (PRODUCTO NUEVO) URIAGE",
    "category": "Serums & Tratamiento Específico",
    "price": 180,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-62",
    "code": "ROSELIANE  CREAM SPF30 ANTIROJECES  CON COLOR",
    "name": "ROSELIANE  CREAM SPF30 ANTIROJECES  CON COLOR URIAGE",
    "category": "Fotoprotección Solar",
    "price": 100,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-63",
    "code": "ROSALIANE SPF 50    CREME CON COLOR",
    "name": "ROSALIANE SPF 50    CREME CON COLOR URIAGE",
    "category": "Fotoprotección Solar",
    "price": 110,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-64",
    "code": "ROSELIANE FLUIDE DERMO NETTOYANT",
    "name": "ROSELIANE FLUIDE DERMO NETTOYANT URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 100,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-65",
    "code": "ROSELIANE SERUM LISSANT  CORRECTOR H.A. 30M",
    "name": "ROSELIANE SERUM LISSANT  CORRECTOR H.A. 30M URIAGE",
    "category": "Serums & Tratamiento Específico",
    "price": 160,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-66",
    "code": "DEODORANT POWER3 ROLL-ON 50ML",
    "name": "DEODORANT POWER3 ROLL-ON 50ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 60,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-67",
    "code": "DEODORANT DOUCERO GENTLE  ROLL ON 50ML",
    "name": "DEODORANT DOUCERO GENTLE  ROLL ON 50ML URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 60,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-68",
    "code": "BARIÉDERM-CICA CREMA CON CUIVRE-ZINC",
    "name": "BARIÉDERM-CICA CREMA CON CUIVRE-ZINC URIAGE",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-69",
    "code": "BARIÉDERM-CICA  DAILY SERUM 30ML",
    "name": "BARIÉDERM-CICA  DAILY SERUM 30ML URIAGE",
    "category": "Serums & Tratamiento Específico",
    "price": 160,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-70",
    "code": "BARIÉDERM-CICA CREMA DE MANOS –  50ML",
    "name": "BARIÉDERM-CICA CREMA DE MANOS –  50ML URIAGE",
    "category": "Hidratación & Cuidado",
    "price": 60,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-71",
    "code": "BARIÉDERM CICA  BAUME LEVRES (LABIOS)",
    "name": "BARIÉDERM CICA  BAUME LEVRES (LABIOS) URIAGE",
    "category": "Cuidado Dermatológico",
    "price": 80,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-72",
    "code": "HELIOCARE OIL FREE COMPACT COLOR  BROWN SPF50+",
    "name": "HELIOCARE OIL FREE COMPACT COLOR  BROWN SPF50+ CANTABRIA",
    "category": "Fotoprotección Solar",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-73",
    "code": "HELIOCARE OIL FREE COMPACT 360° COLOR  BEIGE SPF50+",
    "name": "HELIOCARE OIL FREE COMPACT 360° COLOR  BEIGE SPF50+ CANTABRIA",
    "category": "Fotoprotección Solar",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-74",
    "code": "HELIOCARE  CAPSULAS 240MG  X 60 CAPSULAS",
    "name": "HELIOCARE  CAPSULAS 240MG  X 60 CAPSULAS CANTABRIA",
    "category": "Fotoprotección Solar",
    "price": 140,
    "imageUrl": "/product_capsules.png"
  },
  {
    "id": "dcl-75",
    "code": "PILOPEPTAN WOMAN SERUM POTENCIADOR DE PESTAÑAS Y CEJAS",
    "name": "PILOPEPTAN WOMAN SERUM POTENCIADOR DE PESTAÑAS Y CEJAS GENOVE",
    "category": "Serums & Tratamiento Específico",
    "price": 220,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-76",
    "code": "PILOPEPTAN WOMAN SERUM  REPARADOR CAPILAR 30ML",
    "name": "PILOPEPTAN WOMAN SERUM  REPARADOR CAPILAR 30ML GENOVE",
    "category": "Serums & Tratamiento Específico",
    "price": 140,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-77",
    "code": "SESLASH CRECIMIENTO PESTANAS Y CEJAS 5ML",
    "name": "SESLASH CRECIMIENTO PESTANAS Y CEJAS 5ML SESDERMA",
    "category": "Cuidado Dermatológico",
    "price": 220,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-78",
    "code": "SESLASH BLACK",
    "name": "SESLASH BLACK SESDERMA",
    "category": "Cuidado Dermatológico",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-79",
    "code": "HEXIDERMOL 50ML",
    "name": "HEXIDERMOL 50ML SESDERMA",
    "category": "Cuidado Dermatológico",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-80",
    "code": "ROSTRO STOP AKN LIMPIADOR PURIFICANTE 200 ml",
    "name": "ROSTRO STOP AKN LIMPIADOR PURIFICANTE 200 ml BABE",
    "category": "Limpieza Facial",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-81",
    "code": "ROSTRO STOP AKN HIDRATANTE REPARADORA 50 ML",
    "name": "ROSTRO STOP AKN HIDRATANTE REPARADORA 50 ML BABE",
    "category": "Hidratación & Cuidado",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-82",
    "code": "ROSTRO HIDRO 24H CREMA GEL",
    "name": "ROSTRO HIDRO 24H CREMA GEL BABE",
    "category": "Hidratación & Cuidado",
    "price": 110,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-83",
    "code": "ROSTRO HIDRONUTRITIVA PROTECTORA SPF 20",
    "name": "ROSTRO HIDRONUTRITIVA PROTECTORA SPF 20 BABE",
    "category": "Fotoprotección Solar",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-84",
    "code": "FOTOPROTECION FACIAL SUPER FLUIDO MATIFICANTE SPF 50 50ml",
    "name": "FOTOPROTECION FACIAL SUPER FLUIDO MATIFICANTE SPF 50 50ml BABE",
    "category": "Fotoprotección Solar",
    "price": 110,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-85",
    "code": "GEL SECANTE ANTIACNE 8ML",
    "name": "GEL SECANTE ANTIACNE 8ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-86",
    "code": "ALOE VERA 300ML",
    "name": "ALOE VERA 300ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 90,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-87",
    "code": "REPARADOR LABIAL 15ML",
    "name": "REPARADOR LABIAL 15ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-88",
    "code": "CAPILAR LOCIÓN ANTICAÍDA 100 ML",
    "name": "CAPILAR LOCIÓN ANTICAÍDA 100 ML BABE",
    "category": "Hidratación & Cuidado",
    "price": 190,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-89",
    "code": "CHAMPU EXTRASUAVE 500ML",
    "name": "CHAMPU EXTRASUAVE 500ML BABE",
    "category": "Limpieza Facial",
    "price": 140,
    "imageUrl": "/product_hair.png"
  },
  {
    "id": "dcl-90",
    "code": "CORPORAL ANTIESTRÍAS 200 ML",
    "name": "CORPORAL ANTIESTRÍAS 200 ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-91",
    "code": "GEL HIGIENE ÍNTIMA",
    "name": "GEL HIGIENE ÍNTIMA BABE",
    "category": "Cuidado Dermatológico",
    "price": 70,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-92",
    "code": "JABON  HIDRA-CALM 500 ML",
    "name": "JABON  HIDRA-CALM 500 ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 110,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-93",
    "code": "FLUIDO HIDRA-CALM",
    "name": "FLUIDO HIDRA-CALM BABE",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-94",
    "code": "JABON DE ACEITE OIL SOAP 500ML",
    "name": "JABON DE ACEITE OIL SOAP 500ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-95",
    "code": "UREA 10% LOCIÓN REPARADORA 500ML",
    "name": "UREA 10% LOCIÓN REPARADORA 500ML BABE",
    "category": "Hidratación & Cuidado",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-96",
    "code": "CHAMPÚ EXTRASUAVE PEDIÁTRICO 200 ML",
    "name": "CHAMPÚ EXTRASUAVE PEDIÁTRICO 200 ML BABE",
    "category": "Cuidado Dermatológico",
    "price": 60,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-97",
    "code": "PEDIATRIA LECHE HIDRATANTE CORPORAL PEDIÁTRICO 500 ML",
    "name": "PEDIATRIA LECHE HIDRATANTE CORPORAL PEDIÁTRICO 500 ML BABE",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-98",
    "code": "PASTA  DE AGUA PEDIATRICA",
    "name": "PASTA  DE AGUA PEDIATRICA BABE",
    "category": "Cuidado Dermatológico",
    "price": 100,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-99",
    "code": "NUHANCIAM ANTIEDAD CREMA REDENSIFICANTE Y UNIFICANTE  50ML",
    "name": "NUHANCIAM ANTIEDAD CREMA REDENSIFICANTE Y UNIFICANTE  50ML NUHANCIAM",
    "category": "Hidratación & Cuidado",
    "price": 250,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-100",
    "code": "LECHE CORPORAL DESPIGMENTANTE NUHANCIAM 500 ML",
    "name": "LECHE CORPORAL DESPIGMENTANTE NUHANCIAM 500 ML NUHANCIAM",
    "category": "Cuidado Dermatológico",
    "price": 220,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-101",
    "code": "NUHANCIAM CORRECTOR INTENSIVO ANTIMANCHAS FACIAL 15ML",
    "name": "NUHANCIAM CORRECTOR INTENSIVO ANTIMANCHAS FACIAL 15ML NUHANCIAM",
    "category": "Cuidado Dermatológico",
    "price": 200,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-102",
    "code": "NUHANCIAM  ANTIMANCHAS POTENCIA4  30ML",
    "name": "NUHANCIAM  ANTIMANCHAS POTENCIA4  30ML NUHANCIAM",
    "category": "Cuidado Dermatológico",
    "price": 350,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-103",
    "code": "YEUX CONTORNO DE OJOS  TUBO 20GR",
    "name": "YEUX CONTORNO DE OJOS  TUBO 20GR HIDRISAGE",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-104",
    "code": "TEEN DERM  HYDRA",
    "name": "TEEN DERM  HYDRA ISISPHARMA",
    "category": "Cuidado Dermatológico",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-105",
    "code": "NEOTONE SENSITIVE 30ML",
    "name": "NEOTONE SENSITIVE 30ML ISISPHARMA",
    "category": "Cuidado Dermatológico",
    "price": 160,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-106",
    "code": "NEOTONE SERUM",
    "name": "NEOTONE SERUM ISISPHARMA",
    "category": "Serums & Tratamiento Específico",
    "price": 180,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-107",
    "code": "NEOTONE RADIANCE  SPF 50+ 30ML",
    "name": "NEOTONE RADIANCE  SPF 50+ 30ML ISISPHARMA",
    "category": "Fotoprotección Solar",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-108",
    "code": "NEOTONE EYES",
    "name": "NEOTONE EYES ISISPHARMA",
    "category": "Cuidado Dermatológico",
    "price": 160,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-109",
    "code": "RUBORIL EXPERT M GEL CREM 40ML",
    "name": "RUBORIL EXPERT M GEL CREM 40ML ISISPHARMA",
    "category": "Cuidado Dermatológico",
    "price": 140,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-110",
    "code": "METRORUBORIL AZ",
    "name": "METRORUBORIL AZ ISISPHARMA",
    "category": "Cuidado Dermatológico",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-111",
    "code": "LACTIBON PH3,5 LOCION 120ml",
    "name": "LACTIBON PH3,5 LOCION 120ml MEDIHEALTH",
    "category": "Hidratación & Cuidado",
    "price": 50,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-112",
    "code": "CETOPIC CREMA VITAMINA C 50 g",
    "name": "CETOPIC CREMA VITAMINA C 50 g MEDIHEALTH",
    "category": "Hidratación & Cuidado",
    "price": 120,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-113",
    "code": "ESFUMEL TX Crema Despigmentante x 20 g",
    "name": "ESFUMEL TX Crema Despigmentante x 20 g VALUGE",
    "category": "Hidratación & Cuidado",
    "price": 150,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-114",
    "code": "CICAFISS GEL DE SILICONA  15ML",
    "name": "CICAFISS GEL DE SILICONA  15ML FISSIONLAB",
    "category": "Cuidado Dermatológico",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-115",
    "code": "FISSERUM HYALURONIC 100",
    "name": "FISSERUM HYALURONIC 100 FISSIONLAB",
    "category": "Serums & Tratamiento Específico",
    "price": 200,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-116",
    "code": "FISSERUM ANTI-IMPERFECTIONS MULTI ACTION PHYTO BOTANICAL BLEND",
    "name": "FISSERUM ANTI-IMPERFECTIONS MULTI ACTION PHYTO BOTANICAL BLEND FISSIONLAB",
    "category": "Serums & Tratamiento Específico",
    "price": 200,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-117",
    "code": "FISSERUM RETINOL 3 NIGHT COMPLEX, SQUALANE, HYALURONIC",
    "name": "FISSERUM RETINOL 3 NIGHT COMPLEX, SQUALANE, HYALURONIC FISSIONLAB",
    "category": "Serums & Tratamiento Específico",
    "price": 200,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-118",
    "code": "FISS DOK SUERO CAPILAR 60ML",
    "name": "FISS DOK SUERO CAPILAR 60ML FISSIONLAB",
    "category": "Cuidado Dermatológico",
    "price": 200,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-119",
    "code": "INTELLIGENT  RETINOL SMOOTHING  NIGHT  CREAM",
    "name": "INTELLIGENT  RETINOL SMOOTHING  NIGHT  CREAM MEDIK8",
    "category": "Cuidado Dermatológico",
    "price": 300,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-120",
    "code": "ADVANCED DAY  ULTIMATE  PROTECTOR SPF50+",
    "name": "ADVANCED DAY  ULTIMATE  PROTECTOR SPF50+ MEDIK8",
    "category": "Fotoprotección Solar",
    "price": 320,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-121",
    "code": "DAILY RADIANCE VITAMIN C",
    "name": "DAILY RADIANCE VITAMIN C MEDIK8",
    "category": "Cuidado Dermatológico",
    "price": 330,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-122",
    "code": "UPGRADE CONTORNO DE OJOS 15ML",
    "name": "UPGRADE CONTORNO DE OJOS 15ML SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 180,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-123",
    "code": "UPGRADE AR CREMA REAFIRMANTE Y CALMANTE  50ML",
    "name": "UPGRADE AR CREMA REAFIRMANTE Y CALMANTE  50ML SENSILIS",
    "category": "Hidratación & Cuidado",
    "price": 300,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-124",
    "code": "UPGRADE HIGH POTENCY SERUM 30ML",
    "name": "UPGRADE HIGH POTENCY SERUM 30ML SENSILIS",
    "category": "Serums & Tratamiento Específico",
    "price": 240,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-125",
    "code": "ETERNALIST A.G.E  EYES",
    "name": "ETERNALIST A.G.E  EYES SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 200,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-126",
    "code": "ETERNALIST A.G.E  CREMA DE DIA 50ML",
    "name": "ETERNALIST A.G.E  CREMA DE DIA 50ML SENSILIS",
    "category": "Hidratación & Cuidado",
    "price": 300,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-127",
    "code": "ETERNALIST A.G.E  RETINOL 50ML",
    "name": "ETERNALIST A.G.E  RETINOL 50ML SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 290,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-128",
    "code": "SKIN D-PIGMENT SERUM ATX B3  30ML",
    "name": "SKIN D-PIGMENT SERUM ATX B3  30ML SENSILIS",
    "category": "Serums & Tratamiento Específico",
    "price": 230,
    "imageUrl": "/product_serum.png"
  },
  {
    "id": "dcl-129",
    "code": "SKIN D-PIGMENT AHA10 OVERNIGTH 30ML",
    "name": "SKIN D-PIGMENT AHA10 OVERNIGTH 30ML SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 170,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-130",
    "code": "PHOTOCORECCION AR 50+",
    "name": "PHOTOCORECCION AR 50+ SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-131",
    "code": "PHOTOCORECCION  D-PIGMENT 50 COLOR  40ML",
    "name": "PHOTOCORECCION  D-PIGMENT 50 COLOR  40ML SENSILIS",
    "category": "Cuidado Dermatológico",
    "price": 130,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-132",
    "code": "MICOTERAT 250 MG  X 30 COMPRIMIDOS",
    "name": "MICOTERAT 250 MG  X 30 COMPRIMIDOS BAGO",
    "category": "Cuidado Dermatológico",
    "price": 160,
    "imageUrl": "/product_capsules.png"
  },
  {
    "id": "dcl-133",
    "code": "PILEXIL CASPSULAS   X 50",
    "name": "PILEXIL CASPSULAS   X 50 BAGO",
    "category": "Cuidado Dermatológico",
    "price": 230,
    "imageUrl": "/product_tube.png"
  },
  {
    "id": "dcl-134",
    "code": "BAGOVIR 500MG ANTIVIRAL  X 10 COMPRIMIDOS",
    "name": "BAGOVIR 500MG ANTIVIRAL  X 10 COMPRIMIDOS BAGO",
    "category": "Cuidado Dermatológico",
    "price": 160,
    "imageUrl": "/product_capsules.png"
  }
];

export const getFeaturedProducts = () => {
  return PRODUCTS_DATA.slice(0, 4);
};

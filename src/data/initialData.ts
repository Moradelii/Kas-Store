import { Product, StoreContent, OFFICIAL_JEAN_STYLES, OFFICIAL_JEAN_COLORS } from '../types/index.ts';

export const INITIAL_PRODUCTS: Product[] = [
  // ============================================================
  // HOMBRE — JEANS (Levi's, Pepe, Tommy, KAS)
  // ============================================================
  {
    id: 'kas-jean-h01',
    name: "Levi's 511 Slim Fit Raw Denim",
    category: 'jeans',
    gender: 'hombre',
    brand: "Levi's",
    fitStyle: 'Jean Slim',
    description: "El icónico corte 511™ Slim de Levi's para hombre. Confeccionado en denim selvedge resistente con tiro medio y pierna ajustada desde el muslo hasta el tobillo para una silueta moderna y estilizada.",
    details: [
      "Auténtico denim Levi's de 13.5 oz con orillo reforzado",
      "Corte Slim clásico favorecedor y versátil",
      "Remaches de cobre genuinos y parche de cuero icónico Two Horse",
      "Tejido con elasticidad Levi's Flex para máxima libertad de movimiento",
      "Acabado no lavado (Raw Denim) con evolución personalizada al uso"
    ],
    price: 1350,
    compareAtPrice: 1550,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg',
      '/assets/images/kas_hero_editorial_1793516509192.jpg'
    ],
    colors: [
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Azul Medio', hex: '#2B4C6F' }
    ],
    tag: 'DESTACADO',
    featured: true,
    active: true,
    variants: [
      { size: '28', stock: 4 },
      { size: '30', stock: 8 },
      { size: '32', stock: 12 },
      { size: '34', stock: 10 },
      { size: '36', stock: 6 },
      { size: '38', stock: 4 },
      { size: '40', stock: 2 }
    ],
    totalStock: 46,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'kas-jean-h02',
    name: "Levi's 501 Original Fit Straight Leg",
    category: 'jeans',
    gender: 'hombre',
    brand: "Levi's",
    fitStyle: 'Jean Straight (Recto)',
    description: "El estándar dorado del denim desde 1873. El vaquero 501® Original para hombre cuenta con el legendario cierre de botones metálicos y una pierna recta atemporal que nunca pasa de moda.",
    details: [
      "100% Algodón puro de alto gramaje con caída natural",
      "Corte recto signature con tiro medio",
      "Cierre icónico de botones metálicos grabados Levi's",
      "Costuras doradas en contraste de alta resistencia",
      "Lavado con desgastes sutiles y tonos arena vintage"
    ],
    price: 1450,
    compareAtPrice: 1690,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Azul Medio', hex: '#2B4C6F' },
      { name: 'Azul Claro', hex: '#6A8CA8' },
      { name: 'Beige / Khaki', hex: '#C2B29A' }
    ],
    tag: 'MÁS VENDIDO',
    featured: true,
    active: true,
    variants: [
      { size: '30', stock: 6 },
      { size: '32', stock: 10 },
      { size: '34', stock: 8 },
      { size: '36', stock: 5 },
      { size: '38', stock: 3 },
      { size: '40', stock: 2 }
    ],
    totalStock: 34,
    createdAt: '2026-02-02T10:00:00Z'
  },
  {
    id: 'kas-jean-h03',
    name: 'Pepe Jeans London Spike Relaxed Fit',
    category: 'jeans',
    gender: 'hombre',
    brand: 'Pepe',
    fitStyle: 'Jean Relaxed / Loose',
    description: 'Vaquero relajado de corte loose contemporáneo confeccionado por Pepe Jeans London con técnicas sostenibles Wiser Wash. Ofrece espacio cómodo en muslos con una silueta urbana de tendencia.',
    details: [
      'Denim sostenible tratado con tecnología de ahorro hídrico Wiser Wash',
      'Corte Relaxed / Loose con comodidad superior durante todo el día',
      'Detalles de costuras decorativas exclusivas de Pepe Jeans en bolsillos traseros',
      'Tiro medio con ajuste de cinturón reforzado',
      'Tacto suave y textura premium sin rigidez'
    ],
    price: 1290,
    compareAtPrice: 1490,
    images: [
      '/assets/images/kas_hero_editorial_1793516509192.jpg',
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Azul Claro', hex: '#6A8CA8' },
      { name: 'Gris Claro', hex: '#A8ACB0' },
      { name: 'Blanco / Off-White', hex: '#EDECE8' }
    ],
    tag: 'NUEVO',
    featured: true,
    active: true,
    variants: [
      { size: '28', stock: 3 },
      { size: '30', stock: 7 },
      { size: '32', stock: 9 },
      { size: '34', stock: 8 },
      { size: '36', stock: 4 }
    ],
    totalStock: 31,
    createdAt: '2026-02-03T10:00:00Z'
  },
  {
    id: 'kas-jean-h04',
    name: 'Pepe Jeans Cash Athletic Tapered',
    category: 'jeans',
    gender: 'hombre',
    brand: 'Pepe',
    fitStyle: 'Jean Tapered / Athletic',
    description: 'Diseñado para quienes buscan holgura anatómica en cadera y muslos pero un tobillo ceñido y moderno. Perfecto para calzado deportivo o botas clásicas de piel.',
    details: [
      'Corte Tapered / Athletic con balance de movimiento y elegancia',
      'Denim con elasticidad bidireccional Powerflex de Pepe Jeans',
      'Bolsillo para monedas con remache metálico y logo grabado',
      'Lavado ecológico con matices de desgaste artesanal',
      'Pespuntes reforzados en zonas de mayor tracción'
    ],
    price: 1320,
    compareAtPrice: 1500,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Verde Oliva / Militar', hex: '#4B533E' },
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
      { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' }
    ],
    tag: null,
    featured: false,
    active: true,
    variants: [
      { size: '30', stock: 5 },
      { size: '32', stock: 8 },
      { size: '34', stock: 7 },
      { size: '36', stock: 4 },
      { size: '38', stock: 3 }
    ],
    totalStock: 27,
    createdAt: '2026-02-04T10:00:00Z'
  },
  {
    id: 'kas-jean-h05',
    name: 'Tommy Hilfiger Scanton Skinny Fit Jeans',
    category: 'jeans',
    gender: 'hombre',
    brand: 'Tommy',
    fitStyle: 'Jean Skinny',
    description: 'El jean ajustado emblemático de Tommy Hilfiger. Combina la estética pulida neoyorquina con la máxima elasticidad Comfort Stretch para mantener su silueta sin restringir tus movimientos.',
    details: [
      'Mezcla de algodón elástico Comfort Stretch de Tommy Hilfiger',
      'Corte Skinny moderno desde el muslo hasta el bajo',
      'Distintivo parche de cuero y cinta tricolor en el bolsillo relojero',
      'Botón frontal metálico esmaltado con la marca grabada',
      'Color negro profundo que no destiñe tras lavados'
    ],
    price: 1490,
    compareAtPrice: 1750,
    images: [
      '/assets/images/kas_hero_editorial_1793516509192.jpg',
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' },
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' }
    ],
    tag: 'DESTACADO',
    featured: true,
    active: true,
    variants: [
      { size: '28', stock: 4 },
      { size: '30', stock: 8 },
      { size: '32', stock: 11 },
      { size: '34', stock: 9 },
      { size: '36', stock: 5 },
      { size: '38', stock: 2 }
    ],
    totalStock: 39,
    createdAt: '2026-02-05T10:00:00Z'
  },

  // ============================================================
  // MUJER — JEANS (Levi's, Pepe, Tommy)
  // ============================================================
  {
    id: 'kas-jean-m01',
    name: "Levi's 721 High Rise Skinny Jeans",
    category: 'jeans',
    gender: 'mujer',
    brand: "Levi's",
    fitStyle: 'Jean Skinny',
    description: "El vaquero de tiro alto favorito de Levi's para mujer. Moldea y alarga visualmente la figura con tecnología Levi's Sculpt con Hyperstretch que se adapta a las curvas sin deformarse.",
    details: [
      "Tiro alto de 10 pulgadas que estiliza la cintura y cadera",
      "Pierna Skinny ceñida y elegante hasta el tobillo",
      "Tejido Levi's Sculpt Hyperstretch: máxima retención de forma",
      "Parche Two Horse en tono cuero natural y pestaña roja Red Tab",
      "Bolsillos traseros diseñados estratégicamente para efecto realzador"
    ],
    price: 1390,
    compareAtPrice: 1650,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
      { name: 'Azul Claro', hex: '#6A8CA8' }
    ],
    tag: 'DESTACADO',
    featured: true,
    active: true,
    variants: [
      { size: '24', stock: 3 },
      { size: '26', stock: 6 },
      { size: '28', stock: 10 },
      { size: '30', stock: 8 },
      { size: '32', stock: 5 },
      { size: '34', stock: 3 }
    ],
    totalStock: 35,
    createdAt: '2026-02-06T10:00:00Z'
  },
  {
    id: 'kas-jean-m02',
    name: 'Pepe Jeans Soho Slim Fit Denim',
    category: 'jeans',
    gender: 'mujer',
    brand: 'Pepe',
    fitStyle: 'Jean Slim',
    description: 'Jean femenino de corte slim moderno con tiro medio. Confeccionado por Pepe Jeans con tejido satinado suave que combina la durabilidad del denim con una comodidad envolvente.',
    details: [
      'Corte Slim equilibrado con caída impecable',
      'Tejido con mezcla de modal y algodón para un tacto sedoso único',
      'Detalle del logo Pepe Jeans en metal plateado sobre bolsillo trasero',
      'Pespuntes a tono con remaches pulidos',
      'Efecto estilizador que realza el contorno natural'
    ],
    price: 1280,
    compareAtPrice: 1480,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Azul Medio', hex: '#2B4C6F' },
      { name: 'Blanco / Off-White', hex: '#EDECE8' },
      { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' }
    ],
    tag: 'NUEVO',
    featured: true,
    active: true,
    variants: [
      { size: '26', stock: 4 },
      { size: '28', stock: 8 },
      { size: '30', stock: 7 },
      { size: '32', stock: 6 },
      { size: '34', stock: 4 }
    ],
    totalStock: 29,
    createdAt: '2026-02-07T10:00:00Z'
  },
  {
    id: 'kas-jean-m03',
    name: 'Tommy Hilfiger Venice Straight Fit Jeans',
    category: 'jeans',
    gender: 'mujer',
    brand: 'Tommy',
    fitStyle: 'Jean Straight (Recto)',
    description: 'El clásico recto de mujer de Tommy Hilfiger reinventado. Con tiro medio y pierna recta fluida, es la pieza esencial para looks sofisticados tanto formales como de fin de semana.',
    details: [
      'Denim prémium 99% algodón y 1% elastano para un calce perfecto',
      'Corte recto Straight favorecedor para todo tipo de siluetas',
      'Insignia bordada tricolor Tommy en el bolsillo trasero derecho',
      'Cierre con cremallera y botón metálico insignia de la marca',
      'Lavado limpio con costuras en hilo ámbar'
    ],
    price: 1420,
    compareAtPrice: 1690,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' },
      { name: 'Azul Medio', hex: '#2B4C6F' },
      { name: 'Beige / Khaki', hex: '#C2B29A' }
    ],
    tag: 'MÁS VENDIDO',
    featured: true,
    active: true,
    variants: [
      { size: '26', stock: 5 },
      { size: '28', stock: 9 },
      { size: '30', stock: 8 },
      { size: '32', stock: 6 },
      { size: '34', stock: 3 }
    ],
    totalStock: 31,
    createdAt: '2026-02-08T10:00:00Z'
  },
  {
    id: 'kas-jean-m04',
    name: "Levi's Ribcage Relaxed Wide Leg",
    category: 'jeans',
    gender: 'mujer',
    brand: "Levi's",
    fitStyle: 'Jean Relaxed / Loose',
    description: "El tiro más alto de Levi's con 12 pulgadas super high rise y pernera relaxed holgada inspirada en los años 90. Destaca la cintura mientras aporta un aire contemporáneo desenfadado.",
    details: [
      "Tiro extra alto Ribcage de 12 pulgadas que define la figura",
      "Pernera ancha relajada y recta inspirada en la moda vintage",
      "100% algodón denim de estructura auténtica",
      "Botones metálicos envejecidos y pestaña Levi's clásica",
      "Lavado claro desgastado con look californiano auténtico"
    ],
    price: 1480,
    compareAtPrice: 1720,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Azul Claro', hex: '#6A8CA8' },
      { name: 'Gris Claro', hex: '#A8ACB0' },
      { name: 'Blanco / Off-White', hex: '#EDECE8' }
    ],
    tag: null,
    featured: false,
    active: true,
    variants: [
      { size: '24', stock: 2 },
      { size: '26', stock: 5 },
      { size: '28', stock: 7 },
      { size: '30', stock: 6 },
      { size: '32', stock: 4 }
    ],
    totalStock: 24,
    createdAt: '2026-02-09T10:00:00Z'
  },
  {
    id: 'kas-jean-m05',
    name: 'Pepe Jeans Dion Tapered Fit Denim',
    category: 'jeans',
    gender: 'mujer',
    brand: 'Pepe',
    fitStyle: 'Jean Tapered / Athletic',
    description: 'Corte cónico relajado para mujer con tiro medio-alto, holgura sutil en caderas y ajuste cónico hacia los tobillos. Versátil para llevar doblado sobre zapatillas o mocasines.',
    details: [
      'Corte Tapered / Mom fit moderno con estructura favorecedora',
      'Tejido denim con tecnología ecológica de lavado ozono',
      'Remaches metálicos en oro viejo grabados con la P de Pepe Jeans',
      'Costuras reforzadas para uso intensivo diario',
      'Color militar exclusivo y azul medio clásico'
    ],
    price: 1310,
    compareAtPrice: null,
    images: [
      '/assets/images/kas_category_jeans_1793516509180.jpg'
    ],
    colors: [
      { name: 'Verde Oliva / Militar', hex: '#4B533E' },
      { name: 'Azul Medio', hex: '#2B4C6F' },
      { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' }
    ],
    tag: 'NUEVO',
    featured: false,
    active: true,
    variants: [
      { size: '26', stock: 4 },
      { size: '28', stock: 6 },
      { size: '30', stock: 5 },
      { size: '32', stock: 3 }
    ],
    totalStock: 18,
    createdAt: '2026-02-10T10:00:00Z'
  },

  // ============================================================
  // HOMBRE — CAMISETAS (Tommy, Levi's, Pepe, KAS)
  // ============================================================
  {
    id: 'kas-tee-h01',
    name: 'Tommy Hilfiger Classic Flag Embroidered Tee',
    category: 'camisetas',
    gender: 'hombre',
    brand: 'Tommy',
    description: 'Camiseta de manga corta confeccionada en 100% puro algodón peinado transpirable. Luce la bandera emblemática de Tommy Hilfiger delicadamente bordada en el pecho con cuello redondo acanalado.',
    details: [
      '100% Algodón puro de alta densidad (220 GSM)',
      'Bordado icónico de la bandera de Tommy Hilfiger en el pecho',
      'Cuello redondo en punto elástico indeformable',
      'Corte regular contemporáneo con ajuste perfecto en hombros y torso',
      'Cinta interior de cuello en colores distintivos de la marca'
    ],
    price: 650,
    compareAtPrice: 780,
    images: [
      '/assets/images/kas_category_tees_1793516510873.jpg',
      '/assets/images/kas_product_black_tee_1793516510950.jpg'
    ],
    colors: [
      { name: 'Blanco / Off-White', hex: '#EDECE8' },
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Azul Índigo o Raw Denim', hex: '#1B263B' }
    ],
    tag: 'DESTACADO',
    featured: true,
    active: true,
    variants: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 4 }
    ],
    totalStock: 52,
    createdAt: '2026-02-11T10:00:00Z'
  },
  {
    id: 'kas-tee-h02',
    name: "Levi's Original Graphic Housemark Tee",
    category: 'camisetas',
    gender: 'hombre',
    brand: "Levi's",
    description: "Camiseta gráfica esencial de Levi's para hombre con el clásico logo en forma de ala de murciélago (Batwing) serigrafiado al frente sobre algodón pesado prelavado.",
    details: [
      "100% Algodón jersey de alto gramaje con caída natural",
      "Serigrafía de alta durabilidad del logo Housemark de Levi's",
      "Pespunte reforzado en mangas y dobladillo inferior",
      "Corte regular recto cómodo y atemporal",
      "Tejido preencogido para preservar talla tras lavados"
    ],
    price: 590,
    compareAtPrice: 690,
    images: [
      '/assets/images/kas_product_black_tee_1793516510950.jpg',
      '/assets/images/kas_category_tees_1793516510873.jpg'
    ],
    colors: [
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Gris Oscuro / Antracita', hex: '#2C2D30' },
      { name: 'Blanco / Off-White', hex: '#EDECE8' }
    ],
    tag: 'MÁS VENDIDO',
    featured: true,
    active: true,
    variants: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 3 }
    ],
    totalStock: 44,
    createdAt: '2026-02-12T10:00:00Z'
  },
  {
    id: 'kas-tee-h03',
    name: 'Pepe Jeans Eggo Logo Organic Cotton Tee',
    category: 'camisetas',
    gender: 'hombre',
    brand: 'Pepe',
    description: 'Camiseta de corte regular elaborada en algodón 100% orgánico certificado. Presenta el logotipo minimalista de Pepe Jeans impreso al tono con tacto cero en el pecho.',
    details: [
      'Algodón 100% orgánico cultivado de manera sostenible',
      'Tratamiento siliconado suave para máxima frescura en clima cálido',
      'Corte regular moderno con caída relajada',
      'Etiqueta textil cosida en la manga izquierda',
      'Cuello acanalado de 2.5 cm con costura reforzada'
    ],
    price: 580,
    compareAtPrice: null,
    images: [
      '/assets/images/kas_category_tees_1793516510873.jpg'
    ],
    colors: [
      { name: 'Verde Oliva / Militar', hex: '#4B533E' },
      { name: 'Beige / Khaki', hex: '#C2B29A' },
      { name: 'Azul Medio', hex: '#2B4C6F' }
    ],
    tag: 'NUEVO',
    featured: false,
    active: true,
    variants: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 11 },
      { size: 'XL', stock: 6 }
    ],
    totalStock: 32,
    createdAt: '2026-02-13T10:00:00Z'
  },

  // ============================================================
  // MUJER — CAMISETAS (Tommy, Levi's, Pepe)
  // ============================================================
  {
    id: 'kas-tee-m01',
    name: 'Tommy Hilfiger Heritage V-Neck Slim Tee',
    category: 'camisetas',
    gender: 'mujer',
    brand: 'Tommy',
    description: 'Camiseta femenina de corte entallado con cuello en V confeccionada en algodón elástico suave. Diseñada para lucir impecable sola o debajo de blazers y chaquetas denim.',
    details: [
      '95% Algodón elástico peinado y 5% elastano para un calce ceñido favorecedor',
      'Escote en V con acabado fino que realza el cuello y escote',
      'Bandera de Tommy Hilfiger bordada al frente en el costado',
      'Tejido ligero y sedoso de máxima frescura',
      'Costuras elásticas invisibles que evitan rozaduras'
    ],
    price: 620,
    compareAtPrice: 750,
    images: [
      '/assets/images/kas_category_tees_1793516510873.jpg'
    ],
    colors: [
      { name: 'Blanco / Off-White', hex: '#EDECE8' },
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Beige / Khaki', hex: '#C2B29A' }
    ],
    tag: 'DESTACADO',
    featured: true,
    active: true,
    variants: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 9 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 3 }
    ],
    totalStock: 36,
    createdAt: '2026-02-14T10:00:00Z'
  },
  {
    id: 'kas-tee-m02',
    name: "Levi's The Perfect Tee Vintage Housemark",
    category: 'camisetas',
    gender: 'mujer',
    brand: "Levi's",
    description: "Nombrada 'The Perfect Tee' por una buena razón: su caída equilibrada, su cuello redondo suave y su serigrafía vintage la convierten en la compañera obligada de tus jeans de tiro alto.",
    details: [
      "100% Algodón natural ultra suave de fibra fina",
      "Serigrafía vintage envejecida del logotipo Batwing Levi's",
      "Corte regular fit no ceñido con longitud ideal para meter dentro del pantalón",
      "Manga corta con dobladillo limpio de doble aguja",
      "Lavable a máquina sin pérdida de tono ni forma"
    ],
    price: 570,
    compareAtPrice: 680,
    images: [
      '/assets/images/kas_category_tees_1793516510873.jpg',
      '/assets/images/kas_product_black_tee_1793516510950.jpg'
    ],
    colors: [
      { name: 'Blanco / Off-White', hex: '#EDECE8' },
      { name: 'Gris Claro', hex: '#A8ACB0' },
      { name: 'Negro Absoluto', hex: '#111111' }
    ],
    tag: 'MÁS VENDIDO',
    featured: true,
    active: true,
    variants: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 11 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 9 },
      { size: 'XL', stock: 4 }
    ],
    totalStock: 43,
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'kas-tee-m03',
    name: 'Pepe Jeans New Virginia Slim Tee',
    category: 'camisetas',
    gender: 'mujer',
    brand: 'Pepe',
    description: 'Camiseta de silueta estilizada confeccionada en algodón jersey peinado. Presenta el lettering característico de Pepe Jeans London en tono contrastante brillante sobre el pecho.',
    details: [
      'Algodón 100% peinado de suavidad premium',
      'Corte Slim Fit femenino que estiliza la silueta con naturalidad',
      'Logo Pepe Jeans London estampado con tintas ecológicas al agua',
      'Remate interior con cinta protectora en cuello',
      'Color verde militar sofisticado y negro carbón'
    ],
    price: 560,
    compareAtPrice: null,
    images: [
      '/assets/images/kas_category_tees_1793516510873.jpg'
    ],
    colors: [
      { name: 'Verde Oliva / Militar', hex: '#4B533E' },
      { name: 'Negro Absoluto', hex: '#111111' },
      { name: 'Blanco / Off-White', hex: '#EDECE8' }
    ],
    tag: 'NUEVO',
    featured: false,
    active: true,
    variants: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 7 }
    ],
    totalStock: 28,
    createdAt: '2026-02-16T10:00:00Z'
  }
];

export const INITIAL_CONTENT: StoreContent = {
  announcement: {
    enabled: true,
    text: "MODA PREMIUM HOMBRE & MUJER · LEVI'S, PEPE JEANS & TOMMY HILFIGER · ENVÍOS A TODA HONDURAS DESDE LA MASICA, ATLÁNTIDA"
  },
  hero: {
    tagline: "MODA PREMIUM HOMBRE & MUJER — LEVI'S · PEPE · TOMMY",
    title: 'EL ESTILO ESTÁ EN LOS DETALLES.',
    subtitle: "Descubre nuestra selección exclusiva de jeans y camisetas para hombre y mujer. Marcas líderes internacionales como Levi's, Pepe Jeans y Tommy Hilfiger con garantía de autenticidad y entrega rápida en Honduras.",
    primaryBtnText: 'EXPLORAR CATÁLOGO',
    secondaryBtnText: 'SELECCIÓN DESTACADA',
    imageUrl: '/assets/images/kas_hero_editorial_1793516509192.jpg'
  },
  categories: {
    jeansTitle: 'COLECCIÓN JEANS',
    jeansSubtitle: "Cortes Skinny, Slim, Straight, Tapered y Relaxed para hombre y mujer de Levi's, Pepe y Tommy.",
    jeansImage: '/assets/images/kas_category_jeans_1793516509180.jpg',
    camisetasTitle: 'COLECCIÓN CAMISETAS',
    camisetasSubtitle: 'Algodón peinado premium, siluetas regulares, slim y boxy en colores esenciales para hombre y mujer.',
    camisetasImage: '/assets/images/kas_category_tees_1793516510873.jpg',
    jeansHombre: {
      title: 'JEANS HOMBRE',
      subtitle: "Cortes Slim, Straight, Athletic y Relaxed en denim selvedge resistente para hombre.",
      image: '/assets/images/kas_category_jeans_1793516509180.jpg',
      brands: 'Pepe, Levi´s, Tommy'
    },
    jeansMujer: {
      title: 'JEANS MUJER',
      subtitle: 'Tiro alto Sculpt, Ribcage Wide Leg, Mom fit y calces estilizadores con máxima comodidad.',
      image: '/assets/images/kas_category_jeans_1793516509180.jpg',
      brands: 'Pepe, Levi´s, Tommy'
    },
    camisetasHombre: {
      title: 'CAMISETAS HOMBRE',
      subtitle: 'Algodón peinado 240g, cuello redondo estructurado, siluetas Boxy y Regular de alto gramaje.',
      image: '/assets/images/kas_category_tees_1793516510873.jpg',
      brands: "Tommy Hilfiger, Levi's, Calvin Klein, Guess"
    },
    camisetasMujer: {
      title: 'CAMISETAS MUJER',
      subtitle: 'Escote en V suave, The Perfect Tee, cortes entallados y tejidos de algodón de tacto sedoso.',
      image: '/assets/images/kas_category_tees_1793516510873.jpg',
      brands: "Tommy Hilfiger, Levi's, Pepe Jeans, Guess"
    }
  },
  featuredSection: {
    badge: 'COLECCIÓN PERMANENTE',
    title: 'SELECCIÓN PREMIUM',
    subtitle: 'Prendas imprescindibles de marcas reconocidas con siluetas atemporales y acabados excepcionales.'
  },
  benefits: {
    b1Title: 'Marcas Internacionales Auténticas',
    b1Desc: "Prendas originales Levi's, Pepe Jeans y Tommy Hilfiger confeccionadas con denim de alto gramaje y algodón de máxima pureza.",
    b2Title: 'Asesoría Personalizada en Tallas',
    b2Desc: 'Atención cercana vía WhatsApp para ayudarte a elegir la talla y corte exacto para hombre o mujer antes de despachar.',
    b3Title: 'Compra Fácil y Segura por WhatsApp',
    b3Desc: 'Sin registros ni tarjetas obligatorias. Generas tu pedido en segundos y coordinas pago y entrega directamente.'
  },
  storeInfo: {
    name: 'KAS Store',
    legalName: 'KAS Store Honduras',
    category: 'Jeans y Camisetas Premium para Hombre y Mujer',
    location: 'La Masica, Atlántida, Honduras',
    address: 'La Masica, Atlántida, Honduras',
    phone: '+504 3305-6175',
    whatsapp: '+504 3305-6175',
    whatsappRaw: '50433056175',
    email: 'contacto@kasstore.hn',
    currencySymbol: 'L.',
    currencyCode: 'HNL',
    social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com'
    }
  },
  sizeGuides: {
    jeans: {
      title: 'Guía de Tallas — Jeans (Hombre & Mujer)',
      columns: [
        { key: 'size', label: 'Talla (Cintura)' },
        { key: 'waist', label: 'Cintura (cm)' },
        { key: 'hip', label: 'Cadera (cm)' },
        { key: 'length', label: 'Largo Interior (cm)' }
      ],
      rows: [
        { size: '24 (Mujer)', waist: '60-63', hip: '85-88', length: '78' },
        { size: '26 (Mujer)', waist: '64-67', hip: '89-92', length: '79' },
        { size: '28 (H/M)', waist: '70-73', hip: '93-96', length: '80' },
        { size: '30 (H/M)', waist: '75-78', hip: '97-100', length: '81' },
        { size: '32 (Hombre)', waist: '80-83', hip: '101-104', length: '82' },
        { size: '34 (Hombre)', waist: '85-88', hip: '105-108', length: '82' },
        { size: '36 (Hombre)', waist: '90-93', hip: '109-112', length: '83' },
        { size: '38 (Hombre)', waist: '95-98', hip: '113-116', length: '83' },
        { size: '40 (Hombre)', waist: '100-104', hip: '117-120', length: '84' }
      ],
      tips: [
        'Mide la circunferencia de tu cintura natural en la parte más estrecha.',
        'Para estilos Skinny y Slim, recomendamos tu talla habitual gracias a la elasticidad Comfort Stretch.',
        'Para estilos Straight o Relaxed, el calce es holgado y fiel a la medida clásica.'
      ]
    },
    camisetas: {
      title: 'Guía de Tallas — Camisetas (Hombre & Mujer)',
      columns: [
        { key: 'size', label: 'Talla' },
        { key: 'chest', label: 'Pecho / Busto (cm)' },
        { key: 'length', label: 'Largo Total (cm)' },
        { key: 'shoulder', label: 'Hombro a Hombro (cm)' }
      ],
      rows: [
        { size: 'XS (Mujer)', chest: '80-84', length: '60', shoulder: '37' },
        { size: 'S (H/M)', chest: '88-92', length: '67', shoulder: '42' },
        { size: 'M (H/M)', chest: '96-100', length: '70', shoulder: '45' },
        { size: 'L (H/M)', chest: '104-108', length: '73', shoulder: '48' },
        { size: 'XL (Hombre)', chest: '112-116', length: '76', shoulder: '51' },
        { size: 'XXL (Hombre)', chest: '120-124', length: '78', shoulder: '54' }
      ],
      tips: [
        'Mide el contorno de tu pecho pasando la cinta métrica por debajo de las axilas.',
        'Nuestras camisetas vienen preencogidas para mantener sus medidas lavado tras lavado.',
        'Si prefieres un corte oversize o boxy holgado, pide una talla más de tu medida habitual.'
      ]
    }
  },
  legal: {
    privacyPolicy: 'En KAS Store protegemos tu privacidad. La información solicitada durante el checkout únicamente se utiliza para coordinar la entrega y atención de tu pedido vía WhatsApp. No comercializamos ni transferimos tus datos a terceros bajo ninguna circunstancia.',
    termsOfService: 'Al realizar un pedido en KAS Store, confirmas tu solicitud de compra sujeta a disponibilidad de inventario. Los precios están expresados en Lempiras hondureños (L.). El pago y la entrega se coordinan de forma personalizada por WhatsApp con nuestro equipo en La Masica, Atlántida.'
  }
};

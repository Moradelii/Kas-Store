/**
 * Tarifas y zonas oficiales de envío para KAS Store (La Masica, Atlántida, Honduras)
 * Cobertura real en los 18 departamentos de Honduras mediante transportistas y paquetería local.
 */

export interface ShippingZone {
  zoneId: string;
  zoneName: string;
  baseFeeHnl: number;
  carrierName: string;
  estimatedDeliveryHours: string;
  departamentos: string[];
}

export const FREE_SHIPPING_THRESHOLD_HNL = 1500;

export const HONDURAS_SHIPPING_ZONES: ShippingZone[] = [
  {
    zoneId: 'zona-atlantida',
    zoneName: 'Zona Local Atlántida (Sede La Masica)',
    baseFeeHnl: 80,
    carrierName: 'Encomiendas Litoral / Entrega Local La Masica',
    estimatedDeliveryHours: '24 horas hábiles',
    departamentos: ['Atlántida'],
  },
  {
    zoneId: 'zona-norte',
    zoneName: 'Zona Norte y Valle de Sula',
    baseFeeHnl: 110,
    carrierName: 'Transporte Mirna / Expreso del Litoral',
    estimatedDeliveryHours: '24 a 48 horas hábiles',
    departamentos: ['Cortés', 'Yoro'],
  },
  {
    zoneId: 'zona-centro-sur',
    zoneName: 'Zona Centro y Sur',
    baseFeeHnl: 130,
    carrierName: 'Servientrega Honduras / Rapiexpress',
    estimatedDeliveryHours: '48 horas hábiles',
    departamentos: ['Francisco Morazán', 'Comayagua', 'La Paz', 'Choluteca', 'Valle'],
  },
  {
    zoneId: 'zona-foranea',
    zoneName: 'Zona Occidente, Oriente e Insular',
    baseFeeHnl: 150,
    carrierName: 'Cargo Express Honduras / Encomiendas Nacionales',
    estimatedDeliveryHours: '48 a 72 horas hábiles',
    departamentos: [
      'Colón',
      'Copán',
      'Santa Bárbara',
      'Ocotepeque',
      'Lempira',
      'Intibucá',
      'Olancho',
      'El Paraíso',
      'Gracias a Dios',
      'Islas de la Bahía',
    ],
  },
];

export function getShippingDetails(departamento: string, subtotalHnl: number) {
  const normalizedDept = departamento.trim();
  const matchedZone = HONDURAS_SHIPPING_ZONES.find((z) =>
    z.departamentos.some((d) => d.toLowerCase() === normalizedDept.toLowerCase())
  ) || HONDURAS_SHIPPING_ZONES[2]; // Default to Centro si no coincide

  const isFree = subtotalHnl >= FREE_SHIPPING_THRESHOLD_HNL;
  const shippingFeeHnl = isFree ? 0 : matchedZone.baseFeeHnl;

  return {
    zoneId: matchedZone.zoneId,
    zoneName: matchedZone.zoneName,
    carrierName: matchedZone.carrierName,
    estimatedDeliveryHours: matchedZone.estimatedDeliveryHours,
    baseFeeHnl: matchedZone.baseFeeHnl,
    shippingFeeHnl,
    isFree,
    thresholdHnl: FREE_SHIPPING_THRESHOLD_HNL,
    amountNeededForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD_HNL - subtotalHnl),
  };
}

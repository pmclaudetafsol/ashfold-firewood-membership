import type { Supplier } from '@/types';

/** DEMONSTRATION DATA — three fictional UK firewood suppliers. */

export const PRIMARY_SUPPLIER_ID = 'sup-001';

export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'Wealden Timber Co.',
    contactName: 'Tom Hedley',
    email: 'tom.hedley@example.co.uk',
    phone: '01342 890455',
    town: 'East Grinstead',
    county: 'West Sussex',
    coverageAreas: ['GU', 'RH', 'TN', 'BN', 'KT'],
    onTimeRate: 0.968,
    rating: 4.8,
    activeDeliveries: 34,
    capacityPerWeek: 120,
    moistureComplianceRate: 0.994,
    status: 'active',
  },
  {
    id: 'sup-002',
    name: 'Chilterns Woodfuel',
    contactName: 'Gwen Morris',
    email: 'gwen.morris@example.co.uk',
    phone: '01494 776120',
    town: 'Princes Risborough',
    county: 'Buckinghamshire',
    coverageAreas: ['HP', 'OX', 'SY', 'BA', 'GL', 'NP'],
    onTimeRate: 0.941,
    rating: 4.6,
    activeDeliveries: 27,
    capacityPerWeek: 90,
    moistureComplianceRate: 0.981,
    status: 'active',
  },
  {
    id: 'sup-003',
    name: 'Dales Kiln & Log',
    contactName: 'Alan Beswick',
    email: 'alan.beswick@example.co.uk',
    phone: '01423 550918',
    town: 'Ripon',
    county: 'North Yorkshire',
    coverageAreas: ['HG', 'YO', 'LS', 'EH', 'DL'],
    onTimeRate: 0.912,
    rating: 4.4,
    activeDeliveries: 19,
    capacityPerWeek: 75,
    moistureComplianceRate: 0.973,
    status: 'onboarding',
  },
];

export const suppliersById = new Map(suppliers.map((supplier) => [supplier.id, supplier]));

export const primarySupplier = suppliers[0];

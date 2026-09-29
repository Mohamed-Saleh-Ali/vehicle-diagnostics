// Single source of truth for fixed lists. The client reads categories from GET /api/parts/categories.
export const ROLES = ['technician', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const PART_CATEGORIES = [
  'Brakes',
  'Suspension & Steering',
  'Engine',
  'Ignition',
  'Fuel System',
  'Cooling',
  'Electrical & Battery',
  'Exhaust & Emissions',
  'Transmission & Clutch',
  'Filters & Fluids',
  'Climate Control'
] as const;
export type PartCategory = (typeof PART_CATEGORIES)[number];

export const URGENCY_LEVELS = ['low', 'medium', 'high'] as const;
export type Urgency = (typeof URGENCY_LEVELS)[number];

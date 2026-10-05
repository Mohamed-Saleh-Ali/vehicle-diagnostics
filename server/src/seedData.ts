import type { PartCategory } from '#config';

// Demo data only - invented parts, no real brands or part numbers
type SeedPart = {
  partNumber: string;
  name: string;
  category: PartCategory;
  description: string;
  compatibilityNote: string;
  price: number;
};

export const seedParts: SeedPart[] = [
  { partNumber: 'BRK-1001', name: 'Front brake pad set, ceramic', category: 'Brakes', description: 'Low-dust ceramic pads for front axle, including wear sensors.', compatibilityNote: 'Compact cars 2014-2022', price: 49.9 },
  { partNumber: 'BRK-1002', name: 'Front brake disc, vented (pair)', category: 'Brakes', description: 'Vented discs, 280 mm, coated against corrosion.', compatibilityNote: 'Compact cars 2014-2022', price: 89.0 },
  { partNumber: 'BRK-1003', name: 'Rear brake shoe kit', category: 'Brakes', description: 'Drum brake shoes with springs and adjuster.', compatibilityNote: 'City cars with rear drums', price: 39.5 },
  { partNumber: 'BRK-1004', name: 'Brake caliper, front left', category: 'Brakes', description: 'Remanufactured single-piston caliper.', compatibilityNote: 'Mid-size sedans 2012-2019', price: 74.0 },
  { partNumber: 'BRK-1005', name: 'Brake fluid DOT 4, 1 L', category: 'Brakes', description: 'Replace every 2 years, hygroscopic.', compatibilityNote: 'Universal', price: 11.9 },
  { partNumber: 'SUS-2001', name: 'Stabilizer link, front', category: 'Suspension & Steering', description: 'Common source of clunking over bumps.', compatibilityNote: 'Compact cars 2014-2022', price: 18.5 },
  { partNumber: 'SUS-2002', name: 'Lower control arm with bushing', category: 'Suspension & Steering', description: 'Complete arm, pressed-in bushings and ball joint.', compatibilityNote: 'Mid-size sedans 2012-2019', price: 96.0 },
  { partNumber: 'SUS-2003', name: 'Shock absorber, rear (pair)', category: 'Suspension & Steering', description: 'Twin-tube gas shocks.', compatibilityNote: 'Estate cars 2010-2020', price: 119.0 },
  { partNumber: 'SUS-2004', name: 'Tie rod end, outer', category: 'Suspension & Steering', description: 'Check alignment after replacement.', compatibilityNote: 'Compact SUVs 2016-2023', price: 24.9 },
  { partNumber: 'ENG-3001', name: 'Timing belt kit with water pump', category: 'Engine', description: 'Belt, tensioner, idler and pump in one kit.', compatibilityNote: '1.6 L petrol engines', price: 189.0 },
  { partNumber: 'ENG-3002', name: 'Valve cover gasket', category: 'Engine', description: 'Fixes oil seepage on top of the engine.', compatibilityNote: '4-cylinder petrol engines', price: 22.0 },
  { partNumber: 'ENG-3003', name: 'Engine mount, right', category: 'Engine', description: 'Hydraulic mount, reduces vibration at idle.', compatibilityNote: 'Compact cars 2014-2022', price: 67.5 },
  { partNumber: 'IGN-4001', name: 'Spark plug, iridium', category: 'Ignition', description: 'Long-life plug, pre-gapped.', compatibilityNote: 'Most 4-cylinder petrol engines', price: 12.9 },
  { partNumber: 'IGN-4002', name: 'Ignition coil pack', category: 'Ignition', description: 'Plug-top coil, frequent cause of misfires.', compatibilityNote: '1.4-2.0 L petrol engines', price: 44.0 },
  { partNumber: 'IGN-4003', name: 'Crankshaft position sensor', category: 'Ignition', description: 'Causes stalling or no-start when failing.', compatibilityNote: 'Petrol and diesel 2010-2020', price: 35.0 },
  { partNumber: 'FUE-5001', name: 'Fuel injector, petrol', category: 'Fuel System', description: 'Multi-hole injector, flow-tested.', compatibilityNote: 'Port-injection engines', price: 58.0 },
  { partNumber: 'FUE-5002', name: 'Fuel pump module', category: 'Fuel System', description: 'In-tank pump with level sender.', compatibilityNote: 'Compact cars 2014-2022', price: 145.0 },
  { partNumber: 'FUE-5003', name: 'Fuel filter, diesel', category: 'Fuel System', description: 'With water separator.', compatibilityNote: '1.6-2.0 L diesel engines', price: 27.5 },
  { partNumber: 'COO-6001', name: 'Thermostat with housing', category: 'Cooling', description: 'Opens at 88 °C, with seal.', compatibilityNote: '4-cylinder petrol engines', price: 38.0 },
  { partNumber: 'COO-6002', name: 'Radiator, aluminium', category: 'Cooling', description: 'Direct-fit replacement radiator.', compatibilityNote: 'Mid-size sedans 2012-2019', price: 132.0 },
  { partNumber: 'COO-6003', name: 'Radiator fan assembly', category: 'Cooling', description: 'Fan, shroud and motor.', compatibilityNote: 'Compact cars 2014-2022', price: 110.0 },
  { partNumber: 'ELE-7001', name: '12 V battery, 70 Ah AGM', category: 'Electrical & Battery', description: 'For start-stop vehicles.', compatibilityNote: 'Vehicles with start-stop', price: 159.0 },
  { partNumber: 'ELE-7002', name: 'Alternator, 140 A', category: 'Electrical & Battery', description: 'Remanufactured, tested output.', compatibilityNote: 'Mid-size sedans 2012-2019', price: 229.0 },
  { partNumber: 'ELE-7003', name: 'Starter motor', category: 'Electrical & Battery', description: 'Remanufactured, 1.4 kW.', compatibilityNote: 'Compact cars 2014-2022', price: 175.0 },
  { partNumber: 'EXH-8001', name: 'Exhaust front pipe gasket', category: 'Exhaust & Emissions', description: 'Fixes ticking or blowing noise at cold start.', compatibilityNote: 'Universal fit, 55 mm', price: 8.5 },
  { partNumber: 'EXH-8002', name: 'Lambda sensor, upstream', category: 'Exhaust & Emissions', description: 'Wideband oxygen sensor.', compatibilityNote: 'Petrol engines 2010-2020', price: 79.0 },
  { partNumber: 'TRA-9001', name: 'Clutch kit, 3-piece', category: 'Transmission & Clutch', description: 'Disc, pressure plate and release bearing.', compatibilityNote: 'Manual gearbox, compact cars', price: 239.0 },
  { partNumber: 'TRA-9002', name: 'Gearbox oil 75W-90, 1 L', category: 'Transmission & Clutch', description: 'Fully synthetic manual transmission fluid.', compatibilityNote: 'Manual gearboxes', price: 16.9 },
  { partNumber: 'FLU-1101', name: 'Engine oil 5W-30, 5 L', category: 'Filters & Fluids', description: 'Long-life synthetic oil.', compatibilityNote: 'Most petrol and diesel engines', price: 42.0 },
  { partNumber: 'FLU-1102', name: 'Oil filter', category: 'Filters & Fluids', description: 'Cartridge type with seal.', compatibilityNote: '1.4-2.0 L engines', price: 9.9 },
  { partNumber: 'FLU-1103', name: 'Air filter', category: 'Filters & Fluids', description: 'Panel filter, replace every 30,000 km.', compatibilityNote: 'Compact cars 2014-2022', price: 14.5 },
  { partNumber: 'CLI-1201', name: 'Cabin filter, activated carbon', category: 'Climate Control', description: 'Reduces odours and pollen.', compatibilityNote: 'Compact cars 2014-2022', price: 19.9 },
  { partNumber: 'CLI-1202', name: 'Blower motor resistor', category: 'Climate Control', description: 'Fixes fan working only on the highest speed.', compatibilityNote: 'Mid-size sedans 2012-2019', price: 27.0 },
  { partNumber: 'CLI-1203', name: 'A/C compressor', category: 'Climate Control', description: 'Remanufactured, with clutch.', compatibilityNote: 'Compact SUVs 2016-2023', price: 310.0 }
];

export const seedDiagnoses = [
  {
    symptomDescription: 'Grinding noise from the front wheels when braking, gets worse downhill',
    vehicleNote: 'Compact hatchback, 2017, 118,000 km',
    result: {
      subsystem: 'Brakes',
      possibleCauses: ['Front brake pads worn down to the backing plate', 'Scored front brake discs', 'Stone trapped between disc and shield'],
      recommendedPartCategories: ['Brakes'] as PartCategory[],
      urgency: 'high' as const,
      confidence: 0.82
    }
  },
  {
    symptomDescription: 'Car shakes at idle and the check engine light is on since yesterday',
    vehicleNote: 'Mid-size sedan, 2015, petrol',
    result: {
      subsystem: 'Ignition',
      possibleCauses: ['Failing ignition coil on one cylinder', 'Worn spark plugs', 'Vacuum leak at the intake manifold'],
      recommendedPartCategories: ['Ignition', 'Fuel System'] as PartCategory[],
      urgency: 'medium' as const,
      confidence: 0.71
    }
  }
];

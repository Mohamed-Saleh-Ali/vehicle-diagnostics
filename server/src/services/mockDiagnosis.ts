import type { DiagnosisResult } from '#schemas';

// keyword based fake result for MOCK_AI=1
const RULES: { keywords: string[]; result: DiagnosisResult }[] = [
  {
    keywords: ['brake', 'braking', 'squeal', 'grind', 'pedal'],
    result: {
      subsystem: 'Brakes',
      possibleCauses: ['Worn brake pads', 'Warped or scored brake discs', 'Sticking caliper piston'],
      recommendedPartCategories: ['Brakes'],
      urgency: 'high',
      confidence: 0.78
    }
  },
  {
    keywords: ['overheat', 'temperature', 'coolant', 'steam'],
    result: {
      subsystem: 'Cooling',
      possibleCauses: ['Low coolant level or leak', 'Thermostat stuck closed', 'Failing water pump', 'Radiator fan not switching on'],
      recommendedPartCategories: ['Cooling', 'Filters & Fluids'],
      urgency: 'high',
      confidence: 0.74
    }
  },
  {
    keywords: ['misfire', 'rough idle', 'check engine', 'shaking at idle', 'stalls'],
    result: {
      subsystem: 'Ignition',
      possibleCauses: ['Worn spark plugs', 'Faulty ignition coil', 'Vacuum leak at intake', 'Dirty fuel injector'],
      recommendedPartCategories: ['Ignition', 'Fuel System'],
      urgency: 'medium',
      confidence: 0.66
    }
  },
  {
    keywords: ['battery', 'start', 'crank', 'click', 'dim', 'lights'],
    result: {
      subsystem: 'Electrical & Battery',
      possibleCauses: ['Weak or failing 12 V battery', 'Corroded battery terminals', 'Alternator not charging'],
      recommendedPartCategories: ['Electrical & Battery'],
      urgency: 'medium',
      confidence: 0.7
    }
  },
  {
    keywords: ['steering', 'pull', 'clunk', 'knock', 'bump', 'vibration'],
    result: {
      subsystem: 'Suspension & Steering',
      possibleCauses: ['Worn stabilizer link', 'Worn control arm bushing', 'Wheel alignment out of spec'],
      recommendedPartCategories: ['Suspension & Steering'],
      urgency: 'medium',
      confidence: 0.62
    }
  },
  {
    keywords: ['clutch', 'gear', 'shift', 'slipping', 'transmission'],
    result: {
      subsystem: 'Transmission & Clutch',
      possibleCauses: ['Worn clutch disc', 'Low transmission fluid', 'Faulty clutch release bearing'],
      recommendedPartCategories: ['Transmission & Clutch', 'Filters & Fluids'],
      urgency: 'medium',
      confidence: 0.6
    }
  },
  {
    keywords: ['exhaust', 'smoke', 'smell', 'loud', 'rattle underneath'],
    result: {
      subsystem: 'Exhaust & Emissions',
      possibleCauses: ['Leaking exhaust gasket', 'Damaged exhaust hanger', 'Failing catalytic converter'],
      recommendedPartCategories: ['Exhaust & Emissions'],
      urgency: 'low',
      confidence: 0.58
    }
  },
  {
    keywords: ['air con', 'a/c', 'ac ', 'heater', 'cold air', 'fan'],
    result: {
      subsystem: 'Climate Control',
      possibleCauses: ['Low refrigerant charge', 'Clogged cabin filter', 'Blower motor resistor failed'],
      recommendedPartCategories: ['Climate Control', 'Filters & Fluids'],
      urgency: 'low',
      confidence: 0.64
    }
  }
];

const FALLBACK: DiagnosisResult = {
  subsystem: 'General inspection',
  possibleCauses: ['Description too vague for a specific cause', 'Needs a test drive and visual inspection'],
  recommendedPartCategories: ['Filters & Fluids'],
  urgency: 'low',
  confidence: 0.3
};

export function mockDiagnosis(symptomDescription: string): DiagnosisResult {
  const text = symptomDescription.toLowerCase();
  const match = RULES.find(rule => rule.keywords.some(keyword => text.includes(keyword)));
  return structuredClone(match?.result ?? FALLBACK);
}

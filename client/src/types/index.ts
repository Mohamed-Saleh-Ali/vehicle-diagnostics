// API response types
export type Role = 'technician' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthResponse = { token: string; user: User };

export type Part = {
  _id: string;
  partNumber: string;
  name: string;
  category: string;
  description: string;
  compatibilityNote: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type PartInput = Pick<Part, 'partNumber' | 'name' | 'category' | 'description' | 'compatibilityNote' | 'price'>;

export type Urgency = 'low' | 'medium' | 'high';

export type DiagnosisResult = {
  subsystem: string;
  possibleCauses: string[];
  recommendedPartCategories: string[];
  urgency: Urgency;
  confidence: number;
};

export type Diagnosis = {
  _id: string;
  symptomDescription: string;
  vehicleNote: string;
  result: DiagnosisResult;
  source: 'ai' | 'mock';
  createdAt: string;
};

export type DiagnosisInput = { symptomDescription: string; vehicleNote?: string };

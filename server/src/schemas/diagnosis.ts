import { z } from 'zod';
import { PART_CATEGORIES, URGENCY_LEVELS } from '#config';

export const diagnosisRequestSchema = z.object({
  symptomDescription: z
    .string()
    .trim()
    .min(10, 'Describe the symptom in at least 10 characters')
    .max(1000),
  vehicleNote: z.string().trim().max(200).optional()
});

// expected model output, also sent to the model as JSON schema
export const diagnosisResultSchema = z.object({
  subsystem: z.string().min(2).max(60),
  possibleCauses: z.array(z.string().min(3).max(160)).min(1).max(5),
  recommendedPartCategories: z.array(z.enum(PART_CATEGORIES)).min(1).max(3),
  urgency: z.enum(URGENCY_LEVELS),
  confidence: z.number().min(0).max(1)
});

export type DiagnosisRequestDTO = z.infer<typeof diagnosisRequestSchema>;
export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;

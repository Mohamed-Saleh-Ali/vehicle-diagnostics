import { env, isMockAI } from '#config';
import { httpError } from '#middlewares';
import type { DiagnosisRequestDTO, DiagnosisResult } from '#schemas';
import { mockDiagnosis } from './mockDiagnosis.ts';

type DiagnosisOutcome = { result: DiagnosisResult; source: 'ai' | 'mock' };

const SIMULATED_ERROR_TAG = '[simulate-error]';

// simulated error for testing the error handling in the frontend. 
// The AI service is not connected yet, so we only have a mock implementation.
// run diagnosis is the only place where we call the AI service, so we can simulate an error here.
export async function runDiagnosis({ symptomDescription }: DiagnosisRequestDTO): Promise<DiagnosisOutcome> {
  if (env.DEMO_ERROR_TRIGGER === '1' && symptomDescription.toLowerCase().includes(SIMULATED_ERROR_TAG)) {
    throw httpError(502, 'The AI service did not return a valid diagnosis. Please try again.');
  }
  if (!isMockAI) throw httpError(501, 'Real AI provider not connected yet. Set MOCK_AI=1');

  await new Promise(resolve => setTimeout(resolve, 1200)); // fake latency
  return { result: mockDiagnosis(symptomDescription), source: 'mock' };
}

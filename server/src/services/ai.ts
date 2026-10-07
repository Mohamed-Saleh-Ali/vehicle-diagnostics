import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources';
import { env, isMockAI, PART_CATEGORIES } from '#config';
import { httpError } from '#middlewares';
import { diagnosisResultSchema, type DiagnosisRequestDTO, type DiagnosisResult } from '#schemas';
import { mockDiagnosis } from './mockDiagnosis.ts';

type DiagnosisOutcome = { result: DiagnosisResult; source: 'ai' | 'mock' };

const SYSTEM_PROMPT = `You are an experienced automotive diagnostic technician helping a small independent workshop.
You receive a customer's symptom description and return a structured FIRST diagnosis for a trained technician.

Rules:
- Reply ONLY with a JSON object with the keys: subsystem, possibleCauses, recommendedPartCategories, urgency, confidence.
- subsystem: the most likely affected vehicle subsystem, 1-4 words.
- possibleCauses: 1 to 5 causes, most likely first, each one short sentence (max 160 characters).
- recommendedPartCategories: 1 to 3 values, ONLY from this list: ${PART_CATEGORIES.join(', ')}.
- urgency: "high" if safety is affected (brakes, steering, overheating, fuel smell, flashing warning lights), "medium" if it can get worse soon, otherwise "low".
- confidence: 0 to 1. Vague descriptions get less than 0.5.
- If the text is not about a vehicle problem: subsystem "Unknown", one cause "Not a vehicle symptom", category "Filters & Fluids", urgency "low", confidence 0.
- Never ask questions, never add text outside the JSON.`;

const SIMULATED_ERROR_TAG = '[simulate-error]';

// works with any OpenAI-compatible API (Gemini, Groq, Ollama, OpenAI)
// created lazily so the server can run in mock mode without a key
let client: OpenAI | undefined;
const getClient = () => {
  if (!env.AI_API_KEY) throw httpError(502, 'AI is not configured on the server');
  client ??= new OpenAI({
    apiKey: env.AI_API_KEY,
    baseURL: env.AI_BASE_URL || undefined,
    timeout: env.AI_TIMEOUT_MS,
    maxRetries: 1
  });
  return client;
};

// json_object is a fallback for providers that reject the schema
const responseFormat = (): ChatCompletionCreateParamsNonStreaming['response_format'] =>
  env.AI_JSON_MODE === 'schema' ? zodResponseFormat(diagnosisResultSchema, 'diagnosis') : { type: 'json_object' };

const parseAnswer = (raw: string | null | undefined) => {
  if (!raw) return { ok: false as const, error: 'Empty answer' };
  let json: unknown;
  try {
    // strip ```json fences
    json = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ''));
  } catch {
    return { ok: false as const, error: 'Answer is not valid JSON' };
  }
  const result = diagnosisResultSchema.safeParse(json);
  if (!result.success) {
    return {
      ok: false as const,
      error: result.error.issues.map(i => `${i.path.join('.') || 'root'}: ${i.message}`).join('; ')
    };
  }
  return { ok: true as const, data: result.data };
};

export async function runDiagnosis({ symptomDescription, vehicleNote }: DiagnosisRequestDTO): Promise<DiagnosisOutcome> {
  if (env.DEMO_ERROR_TRIGGER === '1' && symptomDescription.toLowerCase().includes(SIMULATED_ERROR_TAG)) {
    throw httpError(502, 'The AI service did not return a valid diagnosis. Please try again.');
  }

  if (isMockAI) {
    await new Promise(resolve => setTimeout(resolve, 1200)); // fake latency
    return { result: mockDiagnosis(symptomDescription), source: 'mock' };
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Symptom: ${symptomDescription}${vehicleNote ? `\nVehicle: ${vehicleNote}` : ''}` }
  ];

  // one retry with the validation errors
  for (let attempt = 1; attempt <= 2; attempt++) {
    let raw: string | null | undefined;
    try {
      const completion = await getClient().chat.completions.create({
        model: env.AI_MODEL,
        messages,
        temperature: 0.2,
        response_format: responseFormat()
      });
      raw = completion.choices[0]?.message.content;
    } catch (error) {
      console.error('\x1b[31mAI provider error:\x1b[0m', error instanceof Error ? error.message : error);
      throw httpError(502, 'The AI service is not reachable right now. Please try again.');
    }

    const answer = parseAnswer(raw);
    if (answer.ok) return { result: answer.data, source: 'ai' };

    console.warn(`\x1b[33mAI answer invalid (attempt ${attempt}): ${answer.error}\x1b[0m`);
    messages.push(
      { role: 'assistant', content: raw ?? '' },
      { role: 'user', content: `Your answer was invalid: ${answer.error}. Reply again with ONLY the corrected JSON.` }
    );
  }

  throw httpError(502, 'The AI service did not return a valid diagnosis. Please try again.');
}

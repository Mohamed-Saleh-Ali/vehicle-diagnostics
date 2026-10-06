import { Schema, model, type InferSchemaType } from 'mongoose';
import { PART_CATEGORIES, URGENCY_LEVELS } from '#config';

// embedded, always read together with the diagnosis
// because it is always read together with it and never alone.
const resultSchema = new Schema(
  {
    subsystem: { type: String, required: true },
    possibleCauses: { type: [String], required: true },
    recommendedPartCategories: { type: [String], enum: PART_CATEGORIES, required: true },
    urgency: { type: String, enum: URGENCY_LEVELS, required: true },
    confidence: { type: Number, min: 0, max: 1, required: true }
  },
  { _id: false }
);

const diagnosisSchema = new Schema(
  {
    symptomDescription: { type: String, required: true, trim: true },
    vehicleNote: { type: String, default: '', trim: true },
    result: { type: resultSchema, required: true },
    source: { type: String, enum: ['ai', 'mock'], required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
    // ref: 'User' and index: true: The relation every diagnosis belongs to one user. The index makes "my diagnoses" fast.
    // enum: ['ai', 'mock'] :You always know where a result came from. Important for the demo and for honesty.
  },
  { timestamps: true }
);

diagnosisSchema.index({ owner: 1, createdAt: -1 });
// The compound index for "my diagnoses, newest first".

export type DiagnosisDoc = InferSchemaType<typeof diagnosisSchema>;
export const Diagnosis = model('Diagnosis', diagnosisSchema);


// Schema is definded before AI ! 
// The schema is the contract between the app and the AI. 
// The UI, the database, the validation and later the prompt 
// all depend on that shape. If it is fixed first, 
// we can build and test everything with fake data (mock mode)
// and then plug the real model in without changing anything else. 
// so it is like a shell for the AI. The AI is a black box, 
// but we can still build the app around it.

// The result schema is the specification of the AI feature. 
// The model has to answer in exactly this shape, 
// and I validate it anyway, because I never trust a model.
import { Schema, model, type InferSchemaType } from 'mongoose';
import { PART_CATEGORIES } from '#config';

const partSchema = new Schema(
  {
    partNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: PART_CATEGORIES, required: true },
    description: { type: String, default: '', trim: true },
    compatibilityNote: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

partSchema.index({ category: 1, name: 1 });

export type PartDoc = InferSchemaType<typeof partSchema>;
export const Part = model('Part', partSchema);

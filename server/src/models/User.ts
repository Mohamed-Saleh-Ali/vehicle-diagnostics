import { Schema, model, type InferSchemaType } from 'mongoose';
import { ROLES } from '#config';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // never returned unless selected with +password
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'technician', required: true }
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);

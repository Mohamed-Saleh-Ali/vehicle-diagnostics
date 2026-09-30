import mongoose from 'mongoose';
import { env } from '#config';

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI, { dbName: env.DB_NAME });
  console.log(`\x1b[35mMongoDB connected: ${mongoose.connection.name}\x1b[0m`);
}

// npm run seed - resets parts, upserts demo users
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '#db';
import { Part, User } from '#models';
import { seedParts } from './seedData.ts';

const accounts = [
  {
    name: 'Workshop Admin',
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@diagbay.dev',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!',
    role: 'admin' as const
  },
  {
    name: 'Sam Technician',
    email: process.env.SEED_TECH_EMAIL ?? 'tech@diagbay.dev',
    password: process.env.SEED_TECH_PASSWORD ?? 'Tech1234!',
    role: 'technician' as const
  }
];

await connectDB();

const [admin, tech] = await Promise.all(
  accounts.map(async ({ password, ...account }) => {
    const hash = await bcrypt.hash(password, 12);
    await User.updateOne({ email: account.email }, { ...account, password: hash }, { upsert: true });
    return User.findOne({ email: account.email });
  })
);
if (!admin || !tech) throw new Error('Seeding users failed');

await Part.deleteMany({});
await Part.insertMany(seedParts.map(part => ({ ...part, createdBy: admin._id })));

console.log(`\x1b[32mSeeded ${seedParts.length} parts, 2 users (${admin.email}, ${tech.email})\x1b[0m`);
await mongoose.disconnect();

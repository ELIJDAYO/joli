import '@testing-library/jest-dom';
import Product from 'models/Models';
import mongoose from 'mongoose';
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

describe('MongoDB', () => {
  it('Tests MongoDB connection', async () => {
    const result = await Product.find().lean();
    await expect(result.length).toBeGreaterThan(0);
    await mongoose.connection.close();
  });
});

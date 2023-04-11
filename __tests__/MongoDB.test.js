import Product from '../models/Models';
import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
})

describe('MongoDB', () => {
  it('Tests MongoDB connection', async () => {
    const result = await Product.find().lean();
    await expect(result.length).toBeGreaterThan(0);
    await mongoose.connection.close();
  })
})
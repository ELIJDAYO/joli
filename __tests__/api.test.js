import '@testing-library/jest-dom';
import Product from 'models/Models';
import mongoose from 'mongoose';
import { TextEncoder, TextDecoder } from 'util';
import { Client } from '../api/contentful';
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

describe('contentful', () => {
  it('Tests Contentful API connection', async () => {
    const response = await Client.getEntries({
        content_type: "category",
        order: "fields.categoryName",
        limit: 12,
      });

    await expect(response.items).toBeDefined();
  })
})

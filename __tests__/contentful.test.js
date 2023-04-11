import '@testing-library/jest-dom';
import { Client } from '../api/contentful';

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
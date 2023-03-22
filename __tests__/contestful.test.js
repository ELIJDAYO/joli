import '@testing-library/jest-dom';
import { Client } from '../api/contentful';

describe('contentful', () => {
  it('API that connects to the Contentful CMS', async () => {
    const response = await Client.getEntries({
        content_type: "category",
        order: "fields.categoryName",
        limit: 12,
      });

    await expect(response.items).toBeDefined();
  })
})
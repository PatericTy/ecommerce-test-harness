// Example API test suite
const request = require('supertest');
const fixture = require('../../fixtures/products-list.json');

describe('Products API', () => {
  let app;

  beforeAll(() => {
    // Mock Express app for testing
    const express = require('express');
    app = express();
    
    app.get('/api/products', (req, res) => {
      res.json(fixture);
    });
  });

  describe('GET /api/products', () => {
    it('should return product list with correct structure', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data.products');
      expect(Array.isArray(res.body.data.products)).toBe(true);
    });

    it('should return products with required fields', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.body.data.products.length).toBeGreaterThan(0);
      res.body.data.products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock');
      });
    });

    it('should return metadata', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('page');
      expect(res.body.meta).toHaveProperty('limit');
    });

    it('should match fixture response exactly', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.body).toEqual(fixture);
    });
  });
});

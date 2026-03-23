const express = require('express');
const fs = require('fs');
const path = require('path');
const { OIL_PRODUCTS, CATEGORIES } = require('./products');
const { calculateAllKPIs } = require('./kpi-engine');
const { RELATED_SECURITIES } = require('./related-securities');
const { DATA_PATH: SEC_DATA_PATH } = require('./seeking-alpha-fetcher');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

function loadPriceData() {
  const dataPath = path.join(__dirname, '..', 'data', 'price-history.json');
  if (!fs.existsSync(dataPath)) {
    console.error('No price data found. Run: npm run seed');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function loadSecuritiesData() {
  if (!fs.existsSync(SEC_DATA_PATH)) return null;
  return JSON.parse(fs.readFileSync(SEC_DATA_PATH, 'utf-8'));
}

// API: Get all products
app.get('/api/products', (req, res) => {
  res.json(OIL_PRODUCTS);
});

// API: Get categories
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// API: Get KPIs for all products
app.get('/api/kpis', (req, res) => {
  const dataStore = loadPriceData();
  const refDate = req.query.date || new Date().toISOString().split('T')[0];
  const kpis = calculateAllKPIs(dataStore, refDate);
  res.json(kpis);
});

// API: Get price history (last 30 entries per product)
app.get('/api/prices', (req, res) => {
  const dataStore = loadPriceData();
  const trimmed = {};
  for (const [id, history] of Object.entries(dataStore)) {
    trimmed[id] = history.slice(-30);
  }
  res.json(trimmed);
});

// API: Get related stocks & ETFs (static definitions)
app.get('/api/securities', (req, res) => {
  res.json(RELATED_SECURITIES);
});

// API: Get securities with Seeking Alpha performance data
app.get('/api/securities-performance', (req, res) => {
  const secData = loadSecuritiesData();
  if (!secData) {
    return res.status(404).json({ error: 'No securities data. Run: npm run fetch-securities' });
  }
  res.json(secData);
});

// API: Get securities performance by product
app.get('/api/securities-performance/:productId', (req, res) => {
  const secData = loadSecuritiesData();
  if (!secData) {
    return res.status(404).json({ error: 'No securities data. Run: npm run fetch-securities' });
  }
  const product = secData.byProduct[req.params.productId];
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// API: Get related stocks & ETFs for a single product (static)
app.get('/api/securities/:productId', (req, res) => {
  const data = RELATED_SECURITIES[req.params.productId];
  if (!data) return res.status(404).json({ error: 'No securities data for product' });
  res.json(data);
});

// API: Get KPI for a single product
app.get('/api/kpis/:productId', (req, res) => {
  const dataStore = loadPriceData();
  const { productId } = req.params;
  const product = OIL_PRODUCTS.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const history = dataStore[productId];
  if (!history) return res.status(404).json({ error: 'No price data for product' });

  const refDate = req.query.date || new Date().toISOString().split('T')[0];
  const { calculateKPIs } = require('./kpi-engine');
  const kpi = calculateKPIs(history, refDate);
  res.json({ product, kpi });
});

app.listen(PORT, () => {
  console.log(`Oil KPI Tracker running at http://localhost:${PORT}`);
});

/**
 * Generate realistic sample price data for oil products.
 * Run: node src/seed-data.js
 */
const fs = require('fs');
const path = require('path');
const { OIL_PRODUCTS } = require('./products');

// Base prices (approximate real-world ranges)
const BASE_PRICES = {
  crude_wti: 72.0,
  crude_brent: 76.0,
  gasoline_rbob: 2.15,
  diesel_ulsd: 2.55,
  heating_oil: 2.50,
  jet_fuel: 2.65,
  natural_gas: 3.20,
  propane: 0.85,
  naphtha: 620.0,
  fuel_oil: 420.0,
  lpg: 540.0,
  bitumen: 380.0
};

// Daily volatility (std dev as fraction of price)
const VOLATILITY = {
  crude_wti: 0.015,
  crude_brent: 0.014,
  gasoline_rbob: 0.018,
  diesel_ulsd: 0.016,
  heating_oil: 0.016,
  jet_fuel: 0.014,
  natural_gas: 0.025,
  propane: 0.02,
  naphtha: 0.012,
  fuel_oil: 0.013,
  lpg: 0.015,
  bitumen: 0.008
};

function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generatePriceHistory(productId, startDate, endDate) {
  const base = BASE_PRICES[productId];
  const vol = VOLATILITY[productId];
  const history = [];

  let price = base;
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const day = current.getDay();
    // Skip weekends for market prices
    if (day !== 0 && day !== 6) {
      history.push({
        date: current.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      });

      // Random walk with mean reversion
      const meanReversion = (base - price) * 0.02;
      const randomShock = gaussianRandom() * vol * price;
      price = price + meanReversion + randomShock;
      price = Math.max(price * 0.5, Math.min(price * 1.5, price)); // clamp
    }
    current.setDate(current.getDate() + 1);
  }

  return history;
}

function generateAllData() {
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear() - 1, 0, 1); // Jan 1 of last year

  const dataStore = {};
  for (const product of OIL_PRODUCTS) {
    dataStore[product.id] = generatePriceHistory(
      product.id,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'price-history.json'),
    JSON.stringify(dataStore, null, 2)
  );

  console.log(`Generated price data for ${OIL_PRODUCTS.length} products`);
  console.log(`Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log(`Saved to data/price-history.json`);
}

generateAllData();

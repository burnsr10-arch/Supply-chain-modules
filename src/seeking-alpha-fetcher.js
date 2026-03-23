/**
 * Seeking Alpha Data Fetcher
 *
 * Pulls stock/ETF performance data from Seeking Alpha via RapidAPI.
 * Requires a RapidAPI key set as environment variable: RAPIDAPI_KEY
 *
 * Without an API key, falls back to generated sample data so the
 * dashboard is fully functional out of the box.
 *
 * To enable live data:
 *   1. Sign up at https://rapidapi.com/
 *   2. Subscribe to "Seeking Alpha" API (free tier available)
 *   3. Set env: export RAPIDAPI_KEY=your_key_here
 *   4. Run: npm run fetch-securities
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { RELATED_SECURITIES } = require('./related-securities');

const RAPIDAPI_HOST = 'seeking-alpha-api.p.rapidapi.com';
const DATA_PATH = path.join(__dirname, '..', 'data', 'securities-performance.json');

// ──────────────────────────────────────────────────────
// Seeking Alpha RapidAPI Integration
// ──────────────────────────────────────────────────────

function saRequest(endpoint, params = {}) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return Promise.reject(new Error('RAPIDAPI_KEY not set'));

  const query = new URLSearchParams(params).toString();
  const url = `/${endpoint}${query ? '?' + query : ''}`;

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: RAPIDAPI_HOST,
      path: url,
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': apiKey
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse SA response: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timeout')); });
    req.end();
  });
}

/**
 * Fetch real-time quote data for a single ticker from Seeking Alpha.
 */
async function fetchTickerQuote(ticker) {
  const result = await saRequest('symbols', { slugs: ticker });

  if (!result || !result.data || result.data.length === 0) {
    throw new Error(`No data for ${ticker}`);
  }

  const attrs = result.data[0].attributes || {};
  return {
    ticker,
    price: attrs.close || attrs.last || null,
    prevClose: attrs.prevClose || attrs.prev_close || null,
    high52w: attrs.high52 || null,
    low52w: attrs.low52 || null,
    marketCap: attrs.marketCap || null,
    peRatio: attrs.peRatio || null,
    divYield: attrs.divYield || null,
    volume: attrs.volume || null
  };
}

/**
 * Fetch key metrics / performance data for a ticker.
 */
async function fetchTickerMetrics(ticker) {
  try {
    const result = await saRequest('metrics', { slug: ticker });
    if (result && result.data) {
      const attrs = result.data.attributes || result.data;
      return {
        ticker,
        wow: attrs.price_change_1w || attrs.priceChange1W || null,
        mtd: attrs.price_change_mtd || attrs.priceChangeMTD || null,
        ytd: attrs.price_change_ytd || attrs.priceChangeYTD || null,
        oneYear: attrs.price_change_1y || attrs.priceChange1Y || null,
        saRating: attrs.quant_rating || attrs.quantRating || null,
        analystRating: attrs.analyst_rating || attrs.analystRating || null
      };
    }
  } catch (e) {
    // Metrics endpoint may not exist; fall back to comparison
  }

  // Fallback: try comparison endpoint
  try {
    const result = await saRequest('comparison', { option: 'performance', slugs: ticker });
    if (result && result.data) {
      return parseComparisonData(ticker, result.data);
    }
  } catch (e) {
    // ignore
  }

  return null;
}

function parseComparisonData(ticker, data) {
  const perf = {};
  if (Array.isArray(data)) {
    for (const item of data) {
      const a = item.attributes || item;
      if (a.slug === ticker || a.symbol === ticker) {
        perf.wow = a['1w'] || a.price_change_1w || null;
        perf.mtd = a.mtd || a.price_change_mtd || null;
        perf.ytd = a.ytd || a.price_change_ytd || null;
        perf.oneYear = a['1y'] || a.price_change_1y || null;
      }
    }
  }
  return { ticker, ...perf };
}

// ──────────────────────────────────────────────────────
// Fetch all securities or generate sample data
// ──────────────────────────────────────────────────────

function getAllTickers() {
  const tickers = new Set();
  for (const product of Object.values(RELATED_SECURITIES)) {
    for (const sec of product.securities) {
      tickers.add(sec.ticker);
    }
  }
  return [...tickers];
}

async function fetchAllFromSA() {
  const tickers = getAllTickers();
  console.log(`Fetching data for ${tickers.length} tickers from Seeking Alpha...`);

  const results = {};
  let success = 0;
  let failed = 0;

  for (const ticker of tickers) {
    try {
      // Rate limit: 1 request per 500ms to stay within free tier
      await new Promise(r => setTimeout(r, 500));

      const [quote, metrics] = await Promise.all([
        fetchTickerQuote(ticker).catch(() => null),
        fetchTickerMetrics(ticker).catch(() => null)
      ]);

      results[ticker] = {
        ticker,
        price: quote ? quote.price : null,
        prevClose: quote ? quote.prevClose : null,
        high52w: quote ? quote.high52w : null,
        low52w: quote ? quote.low52w : null,
        marketCap: quote ? quote.marketCap : null,
        peRatio: quote ? quote.peRatio : null,
        divYield: quote ? quote.divYield : null,
        wow: metrics ? metrics.wow : null,
        mtd: metrics ? metrics.mtd : null,
        ytd: metrics ? metrics.ytd : null,
        oneYear: metrics ? metrics.oneYear : null,
        saRating: metrics ? metrics.saRating : null,
        source: 'seeking_alpha',
        fetchedAt: new Date().toISOString()
      };
      success++;
      process.stdout.write(`  [${success + failed}/${tickers.length}] ${ticker} OK\n`);
    } catch (err) {
      failed++;
      process.stdout.write(`  [${success + failed}/${tickers.length}] ${ticker} FAILED: ${err.message}\n`);
      results[ticker] = { ticker, error: err.message, source: 'seeking_alpha', fetchedAt: new Date().toISOString() };
    }
  }

  return { results, success, failed };
}

// ──────────────────────────────────────────────────────
// Sample data generator (fallback when no API key)
// ──────────────────────────────────────────────────────

// Realistic baseline prices and characteristics for each ticker
const TICKER_PROFILES = {
  // Crude Oil - Majors & E&P
  XOM:  { price: 108.50, sector: 'major',    vol: 0.02 },
  CVX:  { price: 155.20, sector: 'major',    vol: 0.02 },
  COP:  { price: 112.40, sector: 'ep',       vol: 0.025 },
  EOG:  { price: 128.60, sector: 'ep',       vol: 0.025 },
  PXD:  { price: 245.80, sector: 'ep',       vol: 0.022 },
  OXY:  { price: 58.90,  sector: 'ep',       vol: 0.03 },
  SHEL: { price: 65.40,  sector: 'major',    vol: 0.02 },
  BP:   { price: 35.20,  sector: 'major',    vol: 0.022 },
  TTE:  { price: 62.80,  sector: 'major',    vol: 0.02 },
  EQNR: { price: 28.50,  sector: 'major',    vol: 0.025 },
  ENI:  { price: 31.20,  sector: 'major',    vol: 0.02 },
  CNQ:  { price: 32.60,  sector: 'ep',       vol: 0.025 },

  // Refiners
  MPC:  { price: 165.30, sector: 'refiner',  vol: 0.025 },
  VLO:  { price: 142.80, sector: 'refiner',  vol: 0.025 },
  PSX:  { price: 130.50, sector: 'refiner',  vol: 0.022 },
  HFC:  { price: 56.20,  sector: 'refiner',  vol: 0.028 },
  DK:   { price: 24.80,  sector: 'refiner',  vol: 0.035 },
  PBF:  { price: 42.60,  sector: 'refiner',  vol: 0.032 },
  PARR: { price: 22.40,  sector: 'refiner',  vol: 0.035 },

  // Retail / Distribution
  CASY: { price: 285.40, sector: 'retail',   vol: 0.018 },
  SUN:  { price: 52.30,  sector: 'midstream',vol: 0.02 },

  // Natural Gas
  EQT:  { price: 38.50,  sector: 'gas',      vol: 0.035 },
  SWN:  { price: 7.20,   sector: 'gas',      vol: 0.04 },
  AR:   { price: 28.40,  sector: 'gas',      vol: 0.035 },
  RRC:  { price: 34.60,  sector: 'gas',      vol: 0.035 },
  CHK:  { price: 82.50,  sector: 'gas',      vol: 0.03 },
  LNG:  { price: 172.40, sector: 'gas',      vol: 0.022 },
  KMI:  { price: 18.60,  sector: 'midstream',vol: 0.015 },

  // Midstream / NGL
  TRGP: { price: 88.50,  sector: 'midstream',vol: 0.022 },
  WMB:  { price: 38.20,  sector: 'midstream',vol: 0.018 },
  OKE:  { price: 68.40,  sector: 'midstream',vol: 0.02 },
  AM:   { price: 13.80,  sector: 'midstream',vol: 0.018 },
  SPH:  { price: 18.50,  sector: 'midstream',vol: 0.015 },
  SHLX: { price: 14.20,  sector: 'midstream',vol: 0.015 },
  EPD:  { price: 28.40,  sector: 'midstream',vol: 0.015 },
  ET:   { price: 14.20,  sector: 'midstream',vol: 0.018 },
  MPLX: { price: 36.80,  sector: 'midstream',vol: 0.015 },
  PAA:  { price: 16.50,  sector: 'midstream',vol: 0.018 },
  CVRR: { price: 18.20,  sector: 'midstream',vol: 0.025 },

  // Chemicals / Petrochemicals
  LYB:  { price: 92.40,  sector: 'chemical', vol: 0.022 },
  DOW:  { price: 52.80,  sector: 'chemical', vol: 0.022 },
  CE:   { price: 118.60, sector: 'chemical', vol: 0.025 },
  EMN:  { price: 88.40,  sector: 'chemical', vol: 0.022 },
  TSE:  { price: 24.60,  sector: 'chemical', vol: 0.035 },
  BASFY:{ price: 44.20,  sector: 'chemical', vol: 0.02 },

  // Shipping / Bunker
  STNG: { price: 52.80,  sector: 'shipping', vol: 0.035 },
  FRO:  { price: 18.40,  sector: 'shipping', vol: 0.04 },
  INSW: { price: 42.60,  sector: 'shipping', vol: 0.035 },
  TNK:  { price: 38.20,  sector: 'shipping', vol: 0.038 },
  TRMD: { price: 28.50,  sector: 'shipping', vol: 0.035 },
  ZIM:  { price: 22.40,  sector: 'shipping', vol: 0.045 },
  DAC:  { price: 68.50,  sector: 'shipping', vol: 0.03 },

  // Airlines
  DAL:  { price: 42.60,  sector: 'airline',  vol: 0.028 },
  AAL:  { price: 14.80,  sector: 'airline',  vol: 0.035 },
  UAL:  { price: 48.20,  sector: 'airline',  vol: 0.03 },
  LUV:  { price: 28.40,  sector: 'airline',  vol: 0.025 },

  // Canadian Oil Sands
  SU:   { price: 34.60,  sector: 'oilsands', vol: 0.025 },
  CVE:  { price: 18.40,  sector: 'oilsands', vol: 0.03 },
  IMO:  { price: 52.80,  sector: 'oilsands', vol: 0.025 },
  MEG:  { price: 18.60,  sector: 'oilsands', vol: 0.032 },
  ATH:  { price: 3.80,   sector: 'oilsands', vol: 0.04 },
  'SJR.B': { price: 28.40, sector: 'construction', vol: 0.015 },
  VMC:  { price: 225.60, sector: 'construction', vol: 0.018 },

  // ETFs
  USO:  { price: 72.40,  sector: 'etf_commodity', vol: 0.025 },
  BNO:  { price: 28.60,  sector: 'etf_commodity', vol: 0.024 },
  DBO:  { price: 14.80,  sector: 'etf_commodity', vol: 0.022 },
  XLE:  { price: 88.40,  sector: 'etf_equity',    vol: 0.02 },
  IEO:  { price: 72.60,  sector: 'etf_equity',    vol: 0.022 },
  XOP:  { price: 138.20, sector: 'etf_equity',    vol: 0.025 },
  FILL: { price: 24.80,  sector: 'etf_equity',    vol: 0.02 },
  UGA:  { price: 58.40,  sector: 'etf_commodity', vol: 0.025 },
  CRAK: { price: 32.60,  sector: 'etf_equity',    vol: 0.022 },
  VDE:  { price: 118.40, sector: 'etf_equity',    vol: 0.02 },
  UNG:  { price: 12.80,  sector: 'etf_commodity', vol: 0.04 },
  BOIL: { price: 28.60,  sector: 'etf_leveraged', vol: 0.065 },
  FCG:  { price: 24.80,  sector: 'etf_equity',    vol: 0.028 },
  AMLP: { price: 42.60,  sector: 'etf_equity',    vol: 0.015 },
  MLPA: { price: 48.20,  sector: 'etf_equity',    vol: 0.015 },
  EMLP: { price: 38.40,  sector: 'etf_equity',    vol: 0.015 },
  JETS: { price: 18.60,  sector: 'etf_equity',    vol: 0.025 },
  IYT:  { price: 248.60, sector: 'etf_equity',    vol: 0.018 },
  XLB:  { price: 82.40,  sector: 'etf_equity',    vol: 0.018 },
  VAW:  { price: 185.20, sector: 'etf_equity',    vol: 0.018 },
  IYM:  { price: 118.60, sector: 'etf_equity',    vol: 0.018 },
  BDRY: { price: 8.40,   sector: 'etf_shipping',  vol: 0.045 },
  BOAT: { price: 22.60,  sector: 'etf_shipping',  vol: 0.03 },
  SEA:  { price: 16.80,  sector: 'etf_shipping',  vol: 0.03 },
  XEG:  { price: 14.20,  sector: 'etf_equity',    vol: 0.025 },
  FENY: { price: 24.60,  sector: 'etf_equity',    vol: 0.02 },
  BDRY: { price: 8.40,   sector: 'etf_shipping',  vol: 0.045 }
};

// Seeded random for reproducible sample data
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function seededGaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateSampleData() {
  const tickers = getAllTickers();
  const results = {};
  const today = new Date();

  for (const ticker of tickers) {
    const profile = TICKER_PROFILES[ticker];
    if (!profile) {
      results[ticker] = { ticker, error: 'No profile defined', source: 'sample' };
      continue;
    }

    // Use ticker name as seed for reproducibility
    const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 31 + today.getDate();
    const rng = seededRandom(seed);

    const vol = profile.vol;
    const price = profile.price;

    // Generate plausible % changes
    const wowChange = seededGaussian(rng) * vol * Math.sqrt(5) * 100;    // ~5 trading days
    const mtdChange = seededGaussian(rng) * vol * Math.sqrt(15) * 100;   // ~15 trading days
    const ytdChange = seededGaussian(rng) * vol * Math.sqrt(55) * 100;   // ~55 trading days YTD
    const oneYearChange = seededGaussian(rng) * vol * Math.sqrt(252) * 100;

    // Derive prices from changes
    const currentPrice = Math.round(price * (1 + wowChange / 100) * 100) / 100;
    const weekAgoPrice = Math.round(price * 100) / 100;
    const monthStartPrice = Math.round(currentPrice / (1 + mtdChange / 100) * 100) / 100;
    const yearStartPrice = Math.round(currentPrice / (1 + ytdChange / 100) * 100) / 100;

    // Market cap estimate (in billions)
    const mcapMultiplier = { major: 200, ep: 40, refiner: 45, midstream: 25, gas: 15, chemical: 30,
      shipping: 3, airline: 15, oilsands: 20, retail: 12, construction: 30,
      etf_commodity: 2, etf_equity: 8, etf_leveraged: 1, etf_shipping: 0.1 };
    const mcap = Math.round((mcapMultiplier[profile.sector] || 10) * (currentPrice / price) * 100) / 100;

    // SA-style quant rating (1-5 scale)
    const ratings = ['Strong Sell', 'Sell', 'Hold', 'Buy', 'Strong Buy'];
    const ratingIdx = Math.min(4, Math.max(0, Math.floor(rng() * 3 + 1.5)));

    results[ticker] = {
      ticker,
      name: getTickerName(ticker),
      price: currentPrice,
      prevClose: Math.round(currentPrice * (1 - seededGaussian(rng) * vol * 0.3) * 100) / 100,
      weekAgoPrice,
      monthStartPrice,
      yearStartPrice,
      high52w: Math.round(currentPrice * (1 + Math.abs(seededGaussian(rng)) * 0.2) * 100) / 100,
      low52w: Math.round(currentPrice * (1 - Math.abs(seededGaussian(rng)) * 0.25) * 100) / 100,
      marketCap: mcap + 'B',
      peRatio: profile.sector.startsWith('etf') ? null : Math.round((8 + rng() * 20) * 10) / 10,
      divYield: profile.sector.startsWith('etf_commodity') ? null : Math.round((0.5 + rng() * 5) * 100) / 100,
      wow: Math.round(wowChange * 100) / 100,
      mtd: Math.round(mtdChange * 100) / 100,
      ytd: Math.round(ytdChange * 100) / 100,
      oneYear: Math.round(oneYearChange * 100) / 100,
      saRating: ratings[ratingIdx],
      saUrl: `https://seekingalpha.com/symbol/${ticker.replace('.', '-')}`,
      source: 'sample',
      fetchedAt: today.toISOString()
    };
  }

  return results;
}

function getTickerName(ticker) {
  for (const product of Object.values(RELATED_SECURITIES)) {
    for (const sec of product.securities) {
      if (sec.ticker === ticker) return sec.name;
    }
  }
  return ticker;
}

// ──────────────────────────────────────────────────────
// Main: fetch or generate, then save
// ──────────────────────────────────────────────────────

async function fetchAndSave() {
  const apiKey = process.env.RAPIDAPI_KEY;
  let data;

  if (apiKey) {
    console.log('RAPIDAPI_KEY detected — fetching live data from Seeking Alpha...');
    const { results, success, failed } = await fetchAllFromSA();
    data = results;
    console.log(`\nFetch complete: ${success} succeeded, ${failed} failed`);
  } else {
    console.log('No RAPIDAPI_KEY set — generating sample securities data.');
    console.log('To fetch live data from Seeking Alpha:');
    console.log('  1. Sign up at https://rapidapi.com/');
    console.log('  2. Subscribe to "Seeking Alpha" API');
    console.log('  3. export RAPIDAPI_KEY=your_key');
    console.log('  4. npm run fetch-securities\n');
    data = generateSampleData();
  }

  // Map securities to their products
  const output = {
    meta: {
      source: apiKey ? 'seeking_alpha' : 'sample',
      fetchedAt: new Date().toISOString(),
      totalTickers: Object.keys(data).length,
      apiKeySet: !!apiKey
    },
    tickers: data,
    byProduct: {}
  };

  for (const [productId, product] of Object.entries(RELATED_SECURITIES)) {
    output.byProduct[productId] = {
      label: product.label,
      securities: product.securities.map(sec => ({
        ...sec,
        performance: data[sec.ticker] || null
      }))
    };
  }

  const dataDir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));

  console.log(`Saved ${Object.keys(data).length} ticker records to data/securities-performance.json`);
  return output;
}

// Run if called directly
if (require.main === module) {
  fetchAndSave().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = { fetchAndSave, fetchTickerQuote, fetchTickerMetrics, generateSampleData, getAllTickers, DATA_PATH };

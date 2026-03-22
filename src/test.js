/**
 * Tests for KPI calculation engine.
 */
const { calculateKPIs, pctChange, findClosestPrice } = require('./kpi-engine');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; console.log(`  PASS: ${msg}`); }
  else { failed++; console.error(`  FAIL: ${msg}`); }
}

function approxEqual(a, b, tolerance = 0.01) {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) < tolerance;
}

console.log('Testing pctChange...');
assert(approxEqual(pctChange(110, 100), 10), '110 vs 100 = +10%');
assert(approxEqual(pctChange(90, 100), -10), '90 vs 100 = -10%');
assert(approxEqual(pctChange(100, 100), 0), '100 vs 100 = 0%');
assert(pctChange(100, 0) === null, 'division by zero returns null');
assert(pctChange(null, 100) === null, 'null current returns null');

console.log('\nTesting findClosestPrice...');
const history = [
  { date: '2026-01-02', price: 70 },
  { date: '2026-01-03', price: 71 },
  { date: '2026-01-06', price: 72 },
  { date: '2026-01-07', price: 73 },
];
assert(findClosestPrice(history, '2026-01-06').price === 72, 'exact match');
assert(findClosestPrice(history, '2026-01-05').price === 71, 'falls back to previous day');
assert(findClosestPrice(history, '2026-01-01') === null, 'no data before date');

console.log('\nTesting calculateKPIs...');
const yearHistory = [
  { date: '2025-12-31', price: 68 },   // before year start
  { date: '2026-01-02', price: 70 },   // year start (closest on/before Jan 1)
  { date: '2026-02-27', price: 71 },   // before month start
  { date: '2026-03-01', price: 72 },   // month start
  { date: '2026-03-13', price: 74 },   // week ago
  { date: '2026-03-20', price: 77 },   // current
];
const kpis = calculateKPIs(yearHistory, '2026-03-20');
assert(kpis.currentPrice === 77, 'current price is 77');
assert(approxEqual(kpis.wow.pctChange, ((77 - 74) / 74) * 100), 'WoW % correct');
assert(approxEqual(kpis.mtd.pctChange, ((77 - 72) / 72) * 100), 'MTD % correct');
// YTD: closest on/before Jan 1 is Dec 31 (price 68)
assert(approxEqual(kpis.ytd.pctChange, ((77 - 68) / 68) * 100), 'YTD % correct');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

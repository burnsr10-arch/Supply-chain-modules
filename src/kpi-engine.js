/**
 * KPI Calculation Engine
 * Computes % change for Week-over-Week (WoW), Month-to-Date (MTD), and Year-to-Date (YTD).
 */

function pctChange(current, previous) {
  if (previous === 0 || previous == null || current == null) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function getDateStr(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Given a price history array [{date, price}, ...] sorted by date ascending,
 * calculate KPIs relative to a reference date.
 */
function calculateKPIs(priceHistory, referenceDate) {
  const refDate = new Date(referenceDate);
  const refStr = getDateStr(refDate);

  // Find the most recent price on or before referenceDate
  const currentEntry = findClosestPrice(priceHistory, refStr);
  if (!currentEntry) return null;

  const currentPrice = currentEntry.price;

  // Week ago
  const weekAgoDate = addDays(refDate, -7);
  const weekAgoEntry = findClosestPrice(priceHistory, getDateStr(weekAgoDate));
  const weekAgoPrice = weekAgoEntry ? weekAgoEntry.price : null;

  // Month start (1st of current month)
  const monthStart = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
  const monthStartEntry = findClosestPrice(priceHistory, getDateStr(monthStart));
  const monthStartPrice = monthStartEntry ? monthStartEntry.price : null;

  // Year start (Jan 1st of current year)
  const yearStart = new Date(refDate.getFullYear(), 0, 1);
  const yearStartEntry = findClosestPrice(priceHistory, getDateStr(yearStart));
  const yearStartPrice = yearStartEntry ? yearStartEntry.price : null;

  return {
    currentPrice,
    currentDate: currentEntry.date,
    wow: {
      previousPrice: weekAgoPrice,
      previousDate: weekAgoEntry ? weekAgoEntry.date : null,
      pctChange: pctChange(currentPrice, weekAgoPrice)
    },
    mtd: {
      previousPrice: monthStartPrice,
      previousDate: monthStartEntry ? monthStartEntry.date : null,
      pctChange: pctChange(currentPrice, monthStartPrice)
    },
    ytd: {
      previousPrice: yearStartPrice,
      previousDate: yearStartEntry ? yearStartEntry.date : null,
      pctChange: pctChange(currentPrice, yearStartPrice)
    }
  };
}

/**
 * Find price entry closest to (on or before) the target date.
 */
function findClosestPrice(priceHistory, targetDate) {
  let closest = null;
  for (const entry of priceHistory) {
    if (entry.date <= targetDate) {
      closest = entry;
    } else {
      break;
    }
  }
  return closest;
}

/**
 * Calculate KPIs for all products given a data store.
 * dataStore: { productId: [{date, price}, ...], ... }
 */
function calculateAllKPIs(dataStore, referenceDate) {
  const results = {};
  for (const [productId, history] of Object.entries(dataStore)) {
    results[productId] = calculateKPIs(history, referenceDate);
  }
  return results;
}

module.exports = { calculateKPIs, calculateAllKPIs, pctChange, findClosestPrice };

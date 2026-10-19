/**
 * Price Trend Visualizer helpers.
 * Given a product's current price and its price history, determine whether
 * it's currently a "deal" relative to its own historical average.
 */

export interface PricePoint {
  price: number;
  checkedAt: Date | string;
}

export interface PriceTrend {
  isDrop: boolean;
  dropPercent: number; // positive number, e.g. 5 => 5% cheaper than average
  historicalAverage: number;
}

export function computePriceTrend(currentPrice: number, history: PricePoint[]): PriceTrend {
  if (!history.length) {
    return { isDrop: false, dropPercent: 0, historicalAverage: currentPrice };
  }

  const avg = history.reduce((sum, p) => sum + p.price, 0) / history.length;

  if (avg <= 0 || currentPrice >= avg) {
    return { isDrop: false, dropPercent: 0, historicalAverage: avg };
  }

  const dropPercent = ((avg - currentPrice) / avg) * 100;

  return {
    isDrop: dropPercent >= 1, // only badge meaningful drops (>= 1%)
    dropPercent: Math.round(dropPercent * 10) / 10,
    historicalAverage: Math.round(avg * 100) / 100,
  };
}

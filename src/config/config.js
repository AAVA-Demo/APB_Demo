module.exports = {
  baseUrl: process.env.BASE_URL || 'https://creditcard.dashboard.app',
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  headless: process.env.HEADLESS === 'true',
  slowMo: parseInt(process.env.SLOW_MO) || 0,
  viewport: {
    width: 1920,
    height: 1080
  },
  apiEndpoints: {
    cardsSummary: '/api/cards/summary',
    cards: '/api/cards',
    transactions: '/api/transactions',
    analytics: '/api/analytics'
  }
};
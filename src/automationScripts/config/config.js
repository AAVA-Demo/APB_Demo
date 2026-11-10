module.exports = {
  baseURL: process.env.BASE_URL || 'https://creditcard.example.com',
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO) || 0,
  viewport: {
    width: 1920,
    height: 1080
  },
  testData: {
    users: {
      kpi: { username: 'testuser_kpi', password: 'Pass@123' },
      error: { username: 'testuser_error', password: 'Pass@123' },
      zerocards: { username: 'testuser_zerocards', password: 'Pass@123' },
      fivecards: { username: 'testuser5cards', password: 'Pass@123' },
      nocards: { username: 'testuser_nocards', password: 'Pass@123' },
      tencards: { username: 'testuser10cards', password: 'Pass@123' },
      transactions: { username: 'testuser_transactions', password: 'Pass@123' },
      notransactions: { username: 'testuser_notransactions', password: 'Pass@123' },
      largehistory: { username: 'testuser_largehistory', password: 'Pass@123' },
      categories: { username: 'testuser_categories', password: 'Pass@123' },
      threecategories: { username: 'testuser_threecategories', password: 'Pass@123' },
      twelvemonths: { username: 'testuser12months', password: 'Pass@123' },
      sixmonths: { username: 'testuser6months', password: 'Pass@123' },
      trends: { username: 'testuser_trends', password: 'Pass@123' },
      realtime: { username: 'testuser_realtime', password: 'Pass@123' },
      overlimit: { username: 'testuser_overlimit', password: 'Pass@123' },
      multiple: { username: 'testuser_multiple', password: 'Pass@123' }
    }
  }
};
// ... other TD exports ...
module.exports = {
  // ...
  urls: {
    // ...
    creditCardFraudAlertSystemPrd: 'https://prd.workday.com/credit-card-fraud-alerts',
  },
  urlPatterns: {
    // ...
    creditCardFraudAlertSystemPrd: /credit-card-fraud-alerts/,
  },
  pageTitles: {
    // ...
    creditCardFraudAlertSystemPrd: /Credit Card Fraud Alerts/, // adjust as per app
  },
  fraudAlerts: [
    { id: '001', status: 'New', description: 'Suspicious charge at Store A' },
    { id: '002', status: 'Resolved', description: 'Unusual location login' }
  ],
  statuses: {
    new: 'New',
    resolved: 'Resolved',
    reported: 'Reported',
  },
  errors: {
    resolveFailed: 'Failed to resolve alert. Please try again.',
  },
};

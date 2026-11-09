(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_CONFIG', {
    baseUrl: '/api',
    endpoints: {
      cards: '/cards',
      balances: '/balances',
      transactions: '/transactions',
      monthlyTransactions: '/transactions/monthly',
      cardFinancials: '/cards/financials',
      transactionHistory: '/transactions/history'
    },
    timeout: 5000
  });
})();
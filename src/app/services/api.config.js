(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      BASE_URL: 'https://api.creditcard.demo',
      ENDPOINTS: {
        DASHBOARD_KPI: '/api/dashboard/kpis',
        CARDS: '/api/cards',
        CARD_ANALYSIS: '/api/transactions/card',
        TRANSACTIONS: '/api/transactions'
      },
      TIMEOUT: 5000
    });
})();
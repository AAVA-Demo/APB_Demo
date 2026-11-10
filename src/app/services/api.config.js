(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      BASE_URL: '/api',
      ENDPOINTS: {
        DASHBOARD_KPIS: '/dashboard/kpis',
        CARDS: '/cards',
        CARD_BY_ID: '/cards/:cardId',
        TRANSACTIONS: '/transactions',
        ANALYTICS_SPENDING: '/analytics/spending',
        USER_PROFILE: '/user/profile'
      },
      TIMEOUT: 10000
    });
})();
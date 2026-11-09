(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        cards: '/cards',
        cardsSummary: '/cards/summary',
        transactions: '/transactions',
        userProfile: '/user/profile'
      },
      cacheTimeout: 300000
    });
})();
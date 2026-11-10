(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_CONFIG', {
    baseUrl: 'https://api.creditcard.demo',
    endpoints: {
      dashboard: '/api/dashboard/kpis',
      cards: '/api/cards/summary',
      transactions: '/api/transactions',
      analytics: '/api/analytics/spending'
    },
    timeout: 10000
  }).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptorService');
  }]);
})();
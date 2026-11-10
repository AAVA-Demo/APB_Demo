(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_CONFIG', {
    BASE_URL: 'https://api.creditcard.demo',
    ENDPOINTS: {
      CARDS: '/api/cards/user',
      TRANSACTIONS: '/api/transactions',
      ANALYTICS: '/api/analytics/spending'
    },
    TIMEOUT: 10000
  }).factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
    return {
      request: function(config) {
        var token = $window.localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $window.location.href = '/login';
        }
        return $q.reject(rejection);
      }
    };
  }]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);
})();
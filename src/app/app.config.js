(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      BASE_URL: 'https://api.creditcard.demo.com',
      ENDPOINTS: {
        CREDIT_CARDS: '/api/creditcards',
        TRANSACTIONS: '/api/transactions',
        TRANSACTION_SUMMARY: '/api/transactions/summary',
        CATEGORIES: '/api/categories'
      }
    })
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transactions/transactions.view.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push(['$q', '$window', function($q, $window) {
        return {
          request: function(config) {
            var token = $window.localStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401) {
              $window.location.href = '#!/login';
            }
            return $q.reject(rejection);
          }
        };
      }]);
    }]);
})();
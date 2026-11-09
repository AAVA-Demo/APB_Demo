(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.demo',
      endpoints: {
        cards: '/api/cards',
        cardsSummary: '/api/cards/summary',
        transactions: '/api/transactions',
        transactionsSummary: '/api/transactions/summary',
        categories: '/api/categories',
        analyticsTrends: '/api/analytics/trends',
        authValidate: '/api/auth/validate'
      }
    })
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/assets/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/assets/views/card-list.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/assets/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          const token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();
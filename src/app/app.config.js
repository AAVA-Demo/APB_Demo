(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('transactions', {
          url: '/transactions',
          templateUrl: 'src/app/transactions/transactions.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
      $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
        return {
          request: function(config) {
            var token = localStorage.getItem('authToken') || 'demo-token-12345';
            config.headers.Authorization = 'Bearer ' + token;
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
    }])
    .run(['$rootScope', function($rootScope) {
      $rootScope.appName = 'Credit Card Manager';
    }]);
})();
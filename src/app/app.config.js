(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/transactions/views/transaction-list.html',
          controller: 'TransactionListController',
          controllerAs: 'vm'
        })
        .when('/transactions/:transactionId', {
          templateUrl: 'src/app/transactions/views/transaction-detail.html',
          controller: 'TransactionDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('HttpInterceptorService');
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      timeout: 10000
    });
})();
(function() {
  'use strict';
  angular.module('creditCardApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'src/app/dashboard/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('transactions', {
        url: '/transactions',
        templateUrl: 'src/app/transactions/transactions.view.html',
        controller: 'TransactionController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      });
  }]);
})();
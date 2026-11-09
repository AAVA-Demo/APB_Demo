(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptorService');
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('transactions', {
          url: '/transactions',
          templateUrl: 'src/app/transactions/views/transaction-list.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .state('transactionDetail', {
          url: '/transactions/:transactionId',
          templateUrl: 'src/app/transactions/views/transaction-detail.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
      AuthService.init();
      $rootScope.currentUser = { userId: 'user123', name: 'John Doe' };
    }]);
})();
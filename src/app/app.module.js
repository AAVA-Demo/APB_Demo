(function() {
  'use strict';
  angular.module('creditCardApp', ['ui.router', 'dashboard', 'transactions', 'analytics'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'vm'
        })
        .state('transactions', {
          url: '/transactions',
          templateUrl: 'src/app/transactions/views/transaction-list.html',
          controller: 'transactionController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'analyticsController',
          controllerAs: 'vm'
        });
      $locationProvider.html5Mode(false);
    }])
    .run(['authService', function(authService) {
      authService.initialize();
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCard.dashboard',
    'creditCard.transactions',
    'creditCard.analytics'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/transactions', {
        templateUrl: 'src/app/modules/transactions/transactions.html',
        controller: 'TransactionController',
        controllerAs: 'vm'
      })
      .when('/transactions/:cardId', {
        templateUrl: 'src/app/modules/transactions/transactions.html',
        controller: 'TransactionController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/analytics/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
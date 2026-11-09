(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transactions/transaction-list.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/transactions/:id', {
          templateUrl: 'src/app/modules/transactions/transaction-detail.html',
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
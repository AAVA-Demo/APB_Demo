(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/transactions/views/transaction-list.view.html',
          controller: 'TransactionListController',
          controllerAs: 'vm'
        })
        .when('/transactions/:transactionId', {
          templateUrl: 'src/app/transactions/views/transaction-detail.view.html',
          controller: 'TransactionDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
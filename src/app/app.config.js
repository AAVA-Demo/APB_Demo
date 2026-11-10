(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
      .when('/analytics', {
        templateUrl: 'src/app/analytics/views/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
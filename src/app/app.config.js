(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/transactions', {
        templateUrl: 'src/app/modules/transactions/views/transaction-list.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .when('/transactions/:id', {
        templateUrl: 'src/app/modules/transactions/views/transaction-detail.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/analytics/views/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
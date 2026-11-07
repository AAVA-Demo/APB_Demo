(function() {
  'use strict';
  angular.module('ccApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .when('/transactions', {
        templateUrl: 'src/app/transactions/views/transaction-list.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/dashboard' });
  }]).run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (!AuthService.isAuthenticated()) {
        AuthService.authenticate();
      }
    });
  }]);
})();
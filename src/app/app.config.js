(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/modules/transactions/transactions.html',
          controller: 'TransactionsController',
          controllerAs: 'vm'
        })
        .when('/trends', {
          templateUrl: 'src/app/modules/trends/trends.html',
          controller: 'TrendsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'app.portfolio', 'app.transactions', 'app.analytics'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/portfolio', {
          templateUrl: 'src/app/portfolio/views/portfolio.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/transactions/views/transactions.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/portfolio'
        });
    }]);
})();
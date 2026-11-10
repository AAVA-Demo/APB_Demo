(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'creditCard.dashboard', 'creditCard.analytics', 'creditCard.trends'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/category-spending.html',
          controller: 'CategorySpendingController',
          controllerAs: 'vm'
        })
        .when('/trends', {
          templateUrl: 'src/app/modules/trends/views/trend-analysis.html',
          controller: 'TrendAnalysisController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'app.dashboard', 'app.portfolio', 'app.analytics'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          redirectTo: '/dashboard'
        })
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/portfolio', {
          templateUrl: 'src/app/portfolio/portfolio.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics-dashboard.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
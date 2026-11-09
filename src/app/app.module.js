(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'cc.dashboard', 'cc.cardManagement', 'cc.analytics'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/modules/card-management/card-management.html',
          controller: 'CardManagementController',
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
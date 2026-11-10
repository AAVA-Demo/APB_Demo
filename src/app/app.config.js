(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/management/views/cardManagement.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analyticsDashboard.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
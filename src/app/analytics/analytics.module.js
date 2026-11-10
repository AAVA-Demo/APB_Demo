(function() {
  'use strict';
  angular.module('analytics', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        });
    }]);
})();
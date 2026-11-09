(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/views/dashboard-view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/modules/multi-card/views/multi-card-view.html',
        controller: 'MultiCardController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/analytics/views/analytics-view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
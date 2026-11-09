(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/modules/multi-card/views/card-list.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/modules/multi-card/views/card-detail.html',
        controller: 'CardDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/spending-analytics/views/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/dashboard' });
  }]);
})();
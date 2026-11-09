(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/dashboard.html',
        controller: 'dashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/card-management/card-list.html',
        controller: 'cardManagementController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/card-management/card-detail.html',
        controller: 'cardManagementController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/analytics-dashboard.html',
        controller: 'analyticsController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/dashboard' });
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'dashboard.module', 'cardManagement.module', 'analytics.module'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          redirectTo: '/dashboard'
        })
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/modules/cardManagement/views/card-list.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/modules/cardManagement/views/card-detail.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/card-management/views/card-list.html',
        controller: 'CardListController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/card-management/views/card-detail.html',
        controller: 'CardDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
        controller: 'AnalyticsDashboardController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/dashboard' });
    $httpProvider.interceptors.push('HttpInterceptorService');
  }]);
})();
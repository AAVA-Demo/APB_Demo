(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/assets/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/assets/views/card-management.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/assets/views/card-detail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/assets/views/analytics-dashboard.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('AuthInterceptorService');
    }]);
})();
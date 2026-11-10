(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/modules/card-management/views/card-list.view.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/modules/card-management/views/card-detail.view.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/cards/register/new', {
          templateUrl: 'src/app/modules/card-management/views/card-registration.view.html',
          controller: 'CardRegistrationController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
    }]);
})();
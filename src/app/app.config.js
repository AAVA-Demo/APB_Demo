(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/', {
          redirectTo: '/dashboard'
        })
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
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .constant('API_BASE_URL', 'https://api.creditcard.demo/v1');
})();
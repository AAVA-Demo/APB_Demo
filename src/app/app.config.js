(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        cards: '/cards',
        transactions: '/transactions',
        auth: '/auth/login'
      }
    })
    .constant('AUTH_CONFIG', {
      tokenKey: 'authToken',
      storageType: 'localStorage'
    })
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cards', {
          url: '/cards',
          templateUrl: 'src/app/modules/card-management/card-list.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .state('card-detail', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/modules/card-management/card-detail.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/modules/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }])
    .run(['$http', 'AuthService', function($http, AuthService) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();
    }]);
})();
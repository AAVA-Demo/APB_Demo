(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cards', {
          url: '/cards',
          templateUrl: 'src/app/card-management/card-management.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .state('cardDetail', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/card-management/card-detail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api'
    })
    .factory('AuthInterceptor', ['$q', function($q) {
      return {
        request: function(config) {
          var token = localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();
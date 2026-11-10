(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
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
        .when('/cards/compare', {
          templateUrl: 'src/app/card-management/views/card-comparison.html',
          controller: 'CardComparisonController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          const token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            console.error('Authentication error:', rejection);
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cardManagement', {
          url: '/card-management',
          templateUrl: 'src/app/modules/card-management/card-management.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/modules/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      timeout: 5000
    })
    .constant('CACHE_CONFIG', {
      ttl: 300000
    })
    .constant('CATEGORY_CONSTANTS', [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ])
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
            toastr.error('Authentication failed. Please login again.');
          } else if (rejection.status >= 500) {
            toastr.error('Server error. Please try again later.');
          }
          console.error('HTTP Error:', rejection);
          return $q.reject(rejection);
        }
      };
    }]);
})();
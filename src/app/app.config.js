(function() {
  'use strict';
  angular.module('creditCardApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
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
        templateUrl: 'src/app/card-management/card-list.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .state('cardDetails', {
        url: '/cards/:cardId',
        templateUrl: 'src/app/card-management/card-details.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/analytics.html',
        controller: 'AnalyticsDashboardController',
        controllerAs: 'vm'
      });
    $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          config.headers = config.headers || {};
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
  }]);
})();
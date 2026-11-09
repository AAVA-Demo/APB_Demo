(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'dashboardModule', 'transactionModule', 'analyticsModule'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/views/transaction-list.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/transactions/:id', {
          templateUrl: 'src/app/views/transaction-detail.html',
          controller: 'TransactionController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/views/analytics-dashboard.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .factory('AuthInterceptor', ['$q', '$window', '$injector', function($q, $window, $injector) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            var AuthService = $injector.get('AuthService');
            AuthService.logout();
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();
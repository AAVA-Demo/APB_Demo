(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_ENDPOINTS', {
      dashboard: '/api/dashboard/kpis',
      transactions: '/api/transactions',
      analytics: '/api/analytics/spending',
      cards: '/api/cards'
    })
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/transactions', {
          templateUrl: 'src/app/transactions/views/transaction-list.html',
          controller: 'TransactionListController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.sessionStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $window.location.href = '/login';
          }
          return $q.reject(rejection);
        }
      };
    }])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
      $rootScope.$on('$routeChangeStart', function(event, next) {
        if (!AuthService.isAuthenticated()) {
          event.preventDefault();
          AuthService.redirectToLogin();
        }
      });
    }]);
})();
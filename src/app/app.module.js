(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ui.router',
    'chart.js',
    'app.dashboard',
    'app.cardManagement',
    'app.analytics'
  ])
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
        templateUrl: 'src/app/card-management/card-list.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .state('cardDetail', {
        url: '/cards/:cardId',
        templateUrl: 'src/app/card-management/card-detail.html',
        controller: 'CardManagementController',
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
  .factory('AuthInterceptor', ['$window', '$q', function($window, $q) {
    return {
      request: function(config) {
        var token = $window.sessionStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401 || rejection.status === 403) {
          $window.location.href = '/login';
        }
        return $q.reject(rejection);
      }
    };
  }])
  .run(['AuthService', function(AuthService) {
    AuthService.validateSession();
  }]);
})();
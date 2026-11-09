(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/dashboard.view.html',
        controller: 'KPIDashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/cards/card-list.view.html',
        controller: 'CardListController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/cards/card-detail.view.html',
        controller: 'CardDetailController',
        controllerAs: 'vm'
      })
      .when('/cards/compare/:cardIds', {
        templateUrl: 'src/app/cards/card-comparison.view.html',
        controller: 'CardComparisonController',
        controllerAs: 'vm'
      })
      .when('/transactions', {
        templateUrl: 'src/app/transactions/transaction-list.view.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .when('/transactions/:transactionId', {
        templateUrl: 'src/app/transactions/transaction-detail.view.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    $httpProvider.interceptors.push('AuthInterceptor');
  }]).factory('AuthInterceptor', ['$q', '$window', '$location', function($q, $window, $location) {
    return {
      request: function(config) {
        const token = $window.localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $window.localStorage.removeItem('authToken');
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();
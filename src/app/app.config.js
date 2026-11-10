(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', { templateUrl: 'src/app/dashboard/dashboard.view.html', controller: 'DashboardController', controllerAs: 'vm' })
      .when('/analytics', { templateUrl: 'src/app/analytics/analytics.view.html', controller: 'AnalyticsController', controllerAs: 'vm' })
      .when('/transactions', { templateUrl: 'src/app/transaction/transaction-list.view.html', controller: 'TransactionListController', controllerAs: 'vm' })
      .when('/transactions/:transactionId', { templateUrl: 'src/app/transaction/transaction-detail.view.html', controller: 'TransactionDetailController', controllerAs: 'vm' })
      .otherwise({ redirectTo: '/dashboard' });
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        request: function(config) {
          var token = localStorage.getItem('authToken');
          if (token) { config.headers.Authorization = 'Bearer ' + token; }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) { $location.path('/login'); }
          return $q.reject(rejection);
        }
      };
    }]);
  }]);
})();
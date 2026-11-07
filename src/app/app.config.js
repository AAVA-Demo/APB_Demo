(function() {
  'use strict';
  angular.module('creditCardApp').constant('API_CONFIG', {
    baseUrl: 'https://api.creditcard.demo',
    endpoints: {
      creditCards: '/api/creditcards',
      transactions: '/api/transactions'
    }
  }).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'src/app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('transactions', {
        url: '/transactions?page',
        templateUrl: 'src/app/transactions/transaction-list.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .state('transactionDetail', {
        url: '/transactions/:transactionId',
        templateUrl: 'src/app/transactions/transaction-detail.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      });
  }]).run(['$http', function($http) {
    $http.defaults.headers.common['Authorization'] = 'Bearer mock-jwt-token';
  }]);
})();
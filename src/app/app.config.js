(function() {
  'use strict';
  angular.module('creditCardApp').config(AppConfig).run(AppRun).constant('API_ENDPOINTS', {
    cards: '/api/cards',
    kpis: '/api/kpis/aggregate',
    transactions: '/api/transactions',
    analytics: '/api/analytics/process'
  });
  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
  function AppConfig($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'src/app/dashboard/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('transactions', {
        url: '/transactions',
        templateUrl: 'src/app/transaction/transaction-list.view.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .state('transactionDetail', {
        url: '/transactions/:id',
        templateUrl: 'src/app/transaction/transaction-detail.view.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      });
  }
  AppRun.$inject = ['$rootScope', 'AuthService'];
  function AppRun($rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (!AuthService.isAuthenticated() && toState.name !== 'login') {
        AuthService.login();
      }
    });
  }
})();
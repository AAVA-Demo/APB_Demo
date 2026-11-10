(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cards', {
          url: '/cards',
          templateUrl: 'src/app/modules/card-management/card-list.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .state('cardDetail', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/modules/card-management/card-detail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/modules/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        cards: '/cards',
        transactions: '/transactions',
        monthlySpend: '/transactions/monthly'
      }
    });
})();
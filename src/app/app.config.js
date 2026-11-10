(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cardList', {
          url: '/cards',
          templateUrl: 'src/app/card-management/card-list.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .state('cardDetail', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/card-management/card-detail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }]);
})();
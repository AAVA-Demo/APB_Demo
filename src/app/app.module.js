(function() {
  'use strict';
  angular.module('creditCardApp', ['ui.router', 'app.dashboard', 'app.cardManagement', 'app.analytics'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cardManagement', {
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
    }])
    .run(['AuthService', function(AuthService) {
      if (!AuthService.getUserId()) {
        AuthService.setUserId('user-' + Date.now());
      }
    }]);
})();
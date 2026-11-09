(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('cards', {
          url: '/cards',
          templateUrl: 'src/app/modules/cardManagement/views/cardList.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .state('cardDetail', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/modules/cardManagement/views/cardDetail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/modules/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ui.router',
    'chart.js',
    'app.dashboard',
    'app.cardManagement',
    'app.analytics'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'src/app/dashboard/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('cards', {
        url: '/cards',
        templateUrl: 'src/app/card-management/views/card-list.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .state('cardDetail', {
        url: '/cards/:cardId',
        templateUrl: 'src/app/card-management/views/card-detail.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/views/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      });
  }])
  .constant('API_CONFIG', {
    baseUrl: '/api',
    endpoints: {
      creditCardsSummary: '/creditcards/summary',
      creditCards: '/creditcards',
      transactions: '/transactions',
      userProfile: '/user/profile'
    }
  });
})();
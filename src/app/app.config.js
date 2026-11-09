(function() {
  'use strict';
  angular.module('creditCardApp').config(AppConfig).run(AppRun);
  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
  function AppConfig($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        template: '<div ng-include="\'src/app/dashboard/dashboard.view.html\'"></div>',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('cards', {
        url: '/cards',
        template: '<div ng-include="\'src/app/card-management/card-list.view.html\'"></div>',
        controller: 'CardListController',
        controllerAs: 'vm',
        resolve: {
          cards: ['CardDataService', function(CardDataService) {
            return CardDataService.getAllCards();
          }]
        }
      })
      .state('cardDetail', {
        url: '/cards/:cardId',
        template: '<div ng-include="\'src/app/card-management/card-detail.view.html\'"></div>',
        controller: 'CardDetailController',
        controllerAs: 'vm',
        resolve: {
          cardDetail: ['CardDataService', '$stateParams', function(CardDataService, $stateParams) {
            return CardDataService.getCardDetails($stateParams.cardId);
          }]
        }
      })
      .state('analytics', {
        url: '/analytics',
        template: '<div ng-include="\'src/app/analytics/analytics.view.html\'"></div>',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      });
  }
  AppRun.$inject = ['$rootScope'];
  function AppRun($rootScope) {
    $rootScope.apiBaseUrl = 'https://api.creditcard.demo';
  }
})();
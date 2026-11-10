(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.demo',
      endpoints: {
        cards: '/api/cards',
        transactions: '/api/transactions',
        kpi: '/api/kpi'
      }
    })
    .constant('ISSUER_API_CONFIG', {
      baseUrl: 'https://issuer.api.demo',
      endpoint: '/api/card-metadata'
    })
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
          templateUrl: 'src/app/cards/views/cardList.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .state('cardDetails', {
          url: '/cards/:cardId',
          templateUrl: 'src/app/cards/views/cardDetails.html',
          controller: 'CardDetailsController',
          controllerAs: 'vm'
        })
        .state('cardRegistration', {
          url: '/cards/register',
          templateUrl: 'src/app/cards/views/cardRegistration.html',
          controller: 'CardRegistrationController',
          controllerAs: 'vm'
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }]);
})();
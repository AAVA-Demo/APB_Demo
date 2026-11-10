(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.example.com',
      endpoints: {
        cardsSummary: '/api/cards/summary',
        transactionsMonthly: '/api/transactions/monthly',
        portfolioCards: '/api/portfolio/cards',
        cardSpending: '/api/portfolio/cards/:cardId/spending',
        analyticsSpending: '/api/analytics/spending'
      },
      refreshInterval: 60000
    })
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/portfolio', {
          templateUrl: 'src/app/modules/portfolio/views/portfolio.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        })
        .when('/portfolio/:cardId', {
          templateUrl: 'src/app/modules/portfolio/views/card-detail.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
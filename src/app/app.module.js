(function() {
  'use strict';
  angular.module('creditCardApp', ['ui.router', 'chart.js', 'dashboardModule', 'portfolioModule', 'analyticsModule'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/dashboard');
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .state('portfolio', {
          url: '/portfolio',
          templateUrl: 'src/app/modules/portfolio/portfolio.html',
          controller: 'PortfolioController',
          controllerAs: 'vm',
          resolve: {
            auth: ['AuthenticationService', function(AuthenticationService) {
              return AuthenticationService.validateSession();
            }]
          }
        })
        .state('analytics', {
          url: '/analytics',
          templateUrl: 'src/app/modules/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        });
    }]);
})();
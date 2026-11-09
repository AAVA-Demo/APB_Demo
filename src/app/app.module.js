(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ui.router',
    'dashboardModule',
    'kpiDashboardModule',
    'portfolioManagementModule',
    'cardManagementModule',
    'spendingAnalyticsModule',
    'spendingInsightsModule'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'src/app/dashboard/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('kpiDashboard', {
        url: '/kpi-dashboard',
        templateUrl: 'src/app/kpi-dashboard/kpi-dashboard.view.html',
        controller: 'KPIDashboardController',
        controllerAs: 'vm'
      })
      .state('portfolio', {
        url: '/portfolio',
        templateUrl: 'src/app/portfolio-management/portfolio.view.html',
        controller: 'PortfolioController',
        controllerAs: 'vm'
      })
      .state('cardList', {
        url: '/cards',
        templateUrl: 'src/app/card-management/card-list.view.html',
        controller: 'CardListController',
        controllerAs: 'vm'
      })
      .state('cardDetail', {
        url: '/cards/:cardId',
        templateUrl: 'src/app/card-management/card-detail.view.html',
        controller: 'CardDetailController',
        controllerAs: 'vm'
      })
      .state('analytics', {
        url: '/analytics',
        templateUrl: 'src/app/analytics/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .state('insights', {
        url: '/insights',
        templateUrl: 'src/app/spending-insights/insights.view.html',
        controller: 'InsightsController',
        controllerAs: 'vm'
      });
  }])
  .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (!AuthService.isAuthenticated() && toState.name !== 'login') {
        AuthService.authenticate();
      }
    });
  }]);
})();
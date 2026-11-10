(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/portfolio', {
          templateUrl: 'src/app/portfolio/portfolio.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        })
        .when('/card-detail/:cardId', {
          templateUrl: 'src/app/portfolio/card-detail.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/' });
      $httpProvider.interceptors.push('HttpInterceptorService');
    }])
    .run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
      $rootScope.currentUser = AuthService.getCurrentUser();
    }]);
})();
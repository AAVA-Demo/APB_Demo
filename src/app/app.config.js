(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
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
      $httpProvider.interceptors.push('HttpInterceptorService');
    }])
    .run(['$rootScope', '$location', 'AuthFactory', function($rootScope, $location, AuthFactory) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!AuthFactory.isAuthenticated() && next.$$route && next.$$route.originalPath !== '/login') {
          AuthFactory.mockLogin();
        }
      });
    }]);
})();
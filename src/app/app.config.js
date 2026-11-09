(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/portfolio'
      })
      .when('/portfolio', {
        templateUrl: 'src/app/modules/portfolio/views/portfolio-dashboard.html',
        controller: 'PortfolioDashboardController',
        controllerAs: 'vm'
      })
      .when('/kpi', {
        templateUrl: 'src/app/modules/kpi/views/kpi-dashboard.html',
        controller: 'KpiDashboardController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/analytics/views/analytics-dashboard.html',
        controller: 'AnalyticsDashboardController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
    $httpProvider.interceptors.push('HttpInterceptorService');
  }]);
})();
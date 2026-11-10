(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/card-management/card-portfolio.view.html',
          controller: 'CardPortfolioController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics-dashboard.view.html',
          controller: 'AnalyticsDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
      $httpProvider.interceptors.push(['$q', '$window', function($q, $window) {
        return {
          request: function(config) {
            var token = $window.sessionStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
              $window.location.href = '/login';
            }
            return $q.reject(rejection);
          }
        };
      }]);
    }])
    .run(['$window', function($window) {
      if (!$window.sessionStorage.getItem('authToken')) {
        $window.sessionStorage.setItem('authToken', 'demo-token-' + Date.now());
      }
      if (!$window.sessionStorage.getItem('userId')) {
        $window.sessionStorage.setItem('userId', 'user-123');
      }
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          redirectTo: '/dashboard'
        })
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashCtrl'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'analyticsCtrl'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
      $locationProvider.hashPrefix('!');
    }])
    .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!AuthService.isAuthenticated()) {
          AuthService.mockLogin();
        }
      });
    }]);
})();
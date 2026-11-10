(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        kpi: '/kpi/dashboard',
        cards: '/cards/user',
        transactions: '/transactions',
        analytics: '/analytics',
        auth: '/auth'
      }
    })
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/credit-card-management/views/card-list.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/credit-card-management/views/card-details.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/cards/compare', {
          templateUrl: 'src/app/credit-card-management/views/card-comparison.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics-dashboard.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }]);
})();
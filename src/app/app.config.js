(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/card-management/card-list.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/card-management/card-detail.html',
          controller: 'CardManagementController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
    }])
    .constant('API_CONFIG', {
      baseUrl: '/api',
      endpoints: {
        cards: '/cards',
        transactions: '/transactions',
        monthlyTransactions: '/transactions/monthly',
        cardSpending: '/transactions/spending'
      }
    });
})();
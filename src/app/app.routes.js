(function() {
  'use strict';
  angular.module('creditCardApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/cardManagement/cardList.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .when('/cards/:cardId', {
        templateUrl: 'src/app/cardManagement/cardDetail.html',
        controller: 'CardManagementController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .when('/analytics/history', {
        templateUrl: 'src/app/analytics/transactionHistory.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
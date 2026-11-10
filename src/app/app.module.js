(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'dashboard.kpiModule',
    'creditCard.multiCardModule',
    'analytics.spendingModule'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'src/app/modules/dashboard/kpi/dashboardKpi.html',
        controller: 'DashboardKpiController',
        controllerAs: 'vm'
      })
      .when('/cards', {
        templateUrl: 'src/app/modules/creditCard/multiCard/multiCardView.html',
        controller: 'MultiCardViewController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/modules/analytics/spending/spendingAnalytics.html',
        controller: 'SpendingAnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/views/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/card-management/views/card-list.view.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/card-management/views/card-detail.view.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
      $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .constant('API_ENDPOINTS', {
      dashboard: '/api/dashboard/kpis',
      cards: '/api/cards',
      userProfile: '/api/user-profile',
      transactions: '/api/transactions'
    });
})();
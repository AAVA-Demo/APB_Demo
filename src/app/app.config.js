(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.demo',
      endpoints: {
        kpis: '/api/dashboard/kpis',
        cards: '/api/cards',
        cardSpending: '/api/cards/:cardId/spending',
        analytics: '/api/analytics/spending'
      }
    })
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/dashboard/views/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/modules/card-management/views/card-list.view.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/modules/card-management/views/card-detail.view.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/modules/analytics/views/analytics.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/dashboard' });
    }])
    .run(['$http', 'AuthFactory', function($http, AuthFactory) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthFactory.getAuthToken();
    }]);
})();
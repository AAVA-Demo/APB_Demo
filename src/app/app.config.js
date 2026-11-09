(function() {
  'use strict';
  angular.module('creditCardApp')
    .constant('API_CONFIG', {
      baseUrl: 'https://api.creditcard.demo',
      endpoints: {
        cards: '/cards',
        transactions: '/transactions',
        monthlySpend: '/transactions/monthly-spend',
        cardSpending: '/transactions/spending',
        userAuth: '/user/auth',
        categories: '/categories',
        analyticsAggregate: '/analytics/aggregate'
      }
    })
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/dashboard/dashboard.view.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })
        .when('/cards', {
          templateUrl: 'src/app/credit-card-management/card-list.view.html',
          controller: 'CardListController',
          controllerAs: 'vm'
        })
        .when('/cards/:cardId', {
          templateUrl: 'src/app/credit-card-management/card-detail.view.html',
          controller: 'CardDetailController',
          controllerAs: 'vm'
        })
        .when('/analytics', {
          templateUrl: 'src/app/analytics/analytics-dashboard.view.html',
          controller: 'AnalyticsController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .run(['$http', '$window', function($http, $window) {
      var token = $window.sessionStorage.getItem('authToken') || 'demo-token-12345';
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }]);
})();
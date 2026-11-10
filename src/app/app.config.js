(function() {
  'use strict';
  angular.module('creditCardApp')
    .config(['$routeProvider', '$locationProvider', '$httpProvider', configureApp])
    .constant('API_BASE_URL', '/api')
    .run(['$rootScope', '$location', runBlock]);

  function configureApp($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'src/app/dashboard/views/dashboard.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .when('/transactions', {
        templateUrl: 'src/app/transaction/views/transaction-list.view.html',
        controller: 'TransactionListController',
        controllerAs: 'vm'
      })
      .when('/transactions/:id', {
        templateUrl: 'src/app/transaction/views/transaction-detail.view.html',
        controller: 'TransactionDetailController',
        controllerAs: 'vm'
      })
      .when('/analytics', {
        templateUrl: 'src/app/analytics/views/analytics.view.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/dashboard' });

    $httpProvider.interceptors.push('httpInterceptor');
  }
  configureApp.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

  function runBlock($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      console.error('Route change error:', rejection);
      $location.path('/dashboard');
    });
  }
  runBlock.$inject = ['$rootScope', '$location'];
})();
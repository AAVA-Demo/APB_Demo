(function() {
  'use strict';
  angular.module('transaction', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/transactions', {
          templateUrl: 'src/app/transaction/views/transaction-list.html',
          controller: 'TransactionListController',
          controllerAs: 'vm'
        })
        .when('/transactions/:id', {
          templateUrl: 'src/app/transaction/views/transaction-detail.html',
          controller: 'TransactionDetailController',
          controllerAs: 'vm'
        });
    }]);
})();
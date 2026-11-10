(function() {
  'use strict';
  angular.module('creditCardApp', ['ngRoute', 'portfolio', 'transaction', 'analytics'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', { redirectTo: '/portfolio' })
        .otherwise({ redirectTo: '/portfolio' });
    }]);
})();
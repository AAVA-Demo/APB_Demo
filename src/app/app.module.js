(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCardApp.dashboard',
    'creditCardApp.transactions',
    'creditCardApp.analytics'
  ]);
})();
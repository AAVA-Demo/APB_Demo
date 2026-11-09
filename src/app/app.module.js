(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCardApp.dashboard',
    'creditCardApp.cardManagement',
    'creditCardApp.analytics'
  ]);
})();
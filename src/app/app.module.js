(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngResource',
    'creditCard.dashboard',
    'creditCard.management',
    'creditCard.analytics'
  ]);
})();
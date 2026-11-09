(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCard.dashboard',
    'creditCard.management',
    'creditCard.analytics'
  ]);
})();
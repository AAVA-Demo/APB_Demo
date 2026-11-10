(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'creditCard.dashboard',
    'creditCard.management',
    'creditCard.analytics'
  ]);
})();
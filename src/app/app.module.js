(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCard.dashboard',
    'creditCard.transactions',
    'creditCard.analytics'
  ]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCard.dashboard',
    'creditCard.portfolio',
    'creditCard.analytics'
  ]);
})();
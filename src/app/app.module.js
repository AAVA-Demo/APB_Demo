(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'toastr',
    'creditCard.dashboard',
    'creditCard.portfolio',
    'creditCard.analytics'
  ]);
})();
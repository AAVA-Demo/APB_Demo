(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'creditCard.dashboard',
    'creditCard.management',
    'creditCard.analytics'
  ]);
  angular.module('creditCard.dashboard', []);
  angular.module('creditCard.management', []);
  angular.module('creditCard.analytics', []);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngResource',
    'creditCard.dashboardModule',
    'creditCard.multiCardModule',
    'creditCard.analyticsModule'
  ]);
})();
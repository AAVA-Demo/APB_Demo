(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'creditCard.dashboardModule',
    'creditCard.multiCardModule',
    'creditCard.analyticsModule'
  ]);
})();
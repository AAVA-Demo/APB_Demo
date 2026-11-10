(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ui.bootstrap',
    'chart.js',
    'creditCardApp.dashboard',
    'creditCardApp.transaction',
    'creditCardApp.analytics'
  ]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ui.router',
    'chart.js',
    'creditCardApp.dashboard',
    'creditCardApp.cards',
    'creditCardApp.analytics'
  ]);
})();
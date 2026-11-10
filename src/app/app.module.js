(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngResource',
    'app.dashboard',
    'app.cardManagement',
    'app.analytics'
  ]);
})();
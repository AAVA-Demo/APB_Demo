(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ngRoute',
    'ngSanitize',
    'app.dashboard',
    'app.cardManagement',
    'app.analytics'
  ]);
})();
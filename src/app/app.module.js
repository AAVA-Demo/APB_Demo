(function() {
  'use strict';
  angular.module('creditCardApp', [
    'ui.router',
    'creditCardDashboard',
    'creditCardManagement',
    'spendingAnalytics'
  ]);
})();
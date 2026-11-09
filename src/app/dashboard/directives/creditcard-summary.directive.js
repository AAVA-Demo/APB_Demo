(function() {
  'use strict';
  angular.module('app.dashboard').directive('creditcardSummary', function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      templateUrl: 'src/app/dashboard/directives/creditcard-summary.template.html'
    };
  });
})();
(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardDetail', function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        analysis: '='
      },
      templateUrl: 'src/app/card-management/card-detail-directive.html'
    };
  });
})();
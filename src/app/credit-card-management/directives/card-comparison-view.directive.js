(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardComparisonView', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onRemove: '&'
        },
        templateUrl: 'src/app/credit-card-management/views/card-comparison-view.template.html'
      };
    }]);
})();
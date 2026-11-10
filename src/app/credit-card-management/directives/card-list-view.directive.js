(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardListView', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&',
          onAddToComparison: '&'
        },
        templateUrl: 'src/app/credit-card-management/views/card-list-view.template.html'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardList', function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&',
        filter: '&'
      },
      templateUrl: 'src/app/card-management/card-list-directive.html'
    };
  });
})();
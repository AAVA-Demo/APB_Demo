(function() {
  'use strict';
  angular.module('cc.cardManagement')
    .directive('ccCardList', [ccCardList]);
  function ccCardList() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&'
      },
      templateUrl: 'src/app/directives/templates/card-list.html',
      link: function(scope) {
        scope.selectedCardId = null;
        scope.selectCard = function(card) {
          scope.selectedCardId = card.cardId;
          scope.onSelect({ card: card });
        };
      }
    };
  }
})();
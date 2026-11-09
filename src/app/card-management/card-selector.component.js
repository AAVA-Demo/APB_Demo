(function() {
  'use strict';
  angular.module('app.cardManagement').component('cardSelector', {
    templateUrl: 'src/app/card-management/card-selector.template.html',
    bindings: {
      cards: '<',
      selectedCard: '<',
      onSelect: '&'
    },
    controller: function() {
      var ctrl = this;
      ctrl.isSelected = function(card) {
        return ctrl.selectedCard && ctrl.selectedCard.cardId === card.cardId;
      };
    }
  });
})();
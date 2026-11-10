(function() {
  'use strict';
  angular.module('app.cardManagement').service('CardSwitchService', [function() {
    var selectedCardId = null;
    this.setSelectedCard = function(cardId) {
      selectedCardId = cardId;
    };
    this.getSelectedCard = function() {
      return selectedCardId;
    };
  }]);
})();
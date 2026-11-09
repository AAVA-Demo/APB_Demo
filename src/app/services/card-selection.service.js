(function() {
  'use strict';
  angular.module('cc.cardManagement')
    .service('CardSelectionService', ['$rootScope', CardSelectionService]);
  function CardSelectionService($rootScope) {
    var selectedCardId = null;
    this.selectCard = function(cardId) {
      selectedCardId = cardId;
      $rootScope.$broadcast('card:selected', cardId);
    };
    this.getSelectedCardId = function() {
      return selectedCardId;
    };
  }
})();
(function() {
  'use strict';
  angular.module('app.cards')
    .factory('CardContextFactory', ['$rootScope', function($rootScope) {
      var selectedCardId = null;
      var selectedCard = null;
      
      return {
        setSelectedCard: function(cardId) {
          selectedCardId = cardId;
          $rootScope.$broadcast('cardChanged', cardId);
        },
        getSelectedCardId: function() {
          return selectedCardId;
        },
        setSelectedCardObject: function(card) {
          selectedCard = card;
        },
        getSelectedCardObject: function() {
          return selectedCard;
        }
      };
    }]);
})();
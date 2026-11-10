(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .service('cardManagementService', ['$q', 'cardDataService', 'cardIssuerService', 'authService', function($q, cardDataService, cardIssuerService, authService) {
      var self = this;
      self.getAllCards = function() {
        return authService.getCurrentUser().then(function(user) {
          return cardDataService.getCardsByUserId(user.userId);
        }).then(function(cards) {
          var metadataPromises = cards.map(function(card) {
            return cardIssuerService.getCardMetadata(card.cardId).then(function(metadata) {
              return angular.extend({}, card, metadata);
            });
          });
          return $q.all(metadataPromises);
        }).then(function(cardsWithMetadata) {
          return cardsWithMetadata.map(function(card) {
            card.lastFourDigits = card.cardNumber.slice(-4);
            return card;
          });
        });
      };
      self.getCardDetails = function(cardId) {
        return cardDataService.getCardById(cardId).then(function(card) {
          return cardIssuerService.getCardMetadata(cardId).then(function(metadata) {
            return angular.extend({}, card, metadata);
          });
        });
      };
      self.registerCard = function(cardData) {
        return authService.getCurrentUser().then(function(user) {
          cardData.userId = user.userId;
          return cardDataService.createCard(cardData);
        });
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileService', ['ApiGatewayService', 'CardAuthService', 'CardDataService', '$q', function(ApiGatewayService, CardAuthService, CardDataService, $q) {
      return {
        getUserCards: function(userId) {
          return CardDataService.getAllCards(userId)
            .then(function(cards) {
              var cardIds = cards.map(function(c) { return c.cardId; });
              return CardAuthService.validateCardOwnership(cardIds)
                .then(function() { return cards; });
            });
        }
      };
    }]);
})();
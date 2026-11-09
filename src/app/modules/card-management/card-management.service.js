(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardManagementService', ['CreditCardAPI', 'AuthAPI', '$q', '$cacheFactory', function(CreditCardAPI, AuthAPI, $q, $cacheFactory) {
      const cache = $cacheFactory('cardManagementCache');
      const CACHE_KEY = 'userCards';
      const CACHE_TTL = 300000;

      this.getUserCards = function(userId) {
        const cachedData = cache.get(CACHE_KEY);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
          return $q.resolve(cachedData.data);
        }

        return AuthAPI.validateSession()
          .then(function() {
            return CreditCardAPI.fetchCards(userId);
          })
          .then(function(cards) {
            const totalCreditLimit = cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
            const totalAvailableCredit = cards.reduce((sum, card) => sum + (card.availableCredit || 0), 0);

            const cardList = {
              userId: userId,
              cards: cards,
              totalCards: cards.length,
              totalCreditLimit: totalCreditLimit,
              totalAvailableCredit: totalAvailableCredit
            };

            cache.put(CACHE_KEY, {
              data: cardList,
              timestamp: Date.now()
            });

            return cardList;
          });
      };
    }]);
})();
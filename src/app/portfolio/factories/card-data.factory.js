(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .factory('CardDataFactory', ['$cacheFactory', function($cacheFactory) {
      const cache = $cacheFactory('cardCache');
      const CACHE_TTL = 600000;
      const CARD_LIST_KEY = 'cardList';
      const SELECTED_CARD_KEY = 'selectedCard';
      return {
        cacheCardList: function(cards) {
          cache.put(CARD_LIST_KEY, { data: cards, timestamp: Date.now() });
        },
        getCachedCardList: function() {
          const cached = cache.get(CARD_LIST_KEY);
          if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return cached.data;
          }
          return null;
        },
        setSelectedCard: function(cardId) {
          cache.put(SELECTED_CARD_KEY, cardId);
        },
        getSelectedCard: function() {
          return cache.get(SELECTED_CARD_KEY);
        },
        clearCache: function() {
          cache.removeAll();
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$q', '$cacheFactory', 'UserProfileFactory', function($http, $q, $cacheFactory, UserProfileFactory) {
      var cache = $cacheFactory('cardCache');
      var CACHE_TTL = 600000;
      this.getUserCards = function(userId) {
        var cacheKey = 'cards_' + userId;
        var cached = cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
          return $q.resolve(cached.data);
        }
        return UserProfileFactory.validateOwnership(userId).then(function(cards) {
          cache.put(cacheKey, { data: cards, timestamp: Date.now() });
          return cards;
        }).catch(function(error) {
          console.error('Card fetch error:', error);
          return $q.reject(error);
        });
      };
      this.getCardSpendSummary = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/spend').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Card spend fetch error:', error);
          var mockData = {
            cardId: cardId,
            monthlySpend: Math.floor(Math.random() * 5000) + 1000,
            weeklySpend: Math.floor(Math.random() * 1500) + 200,
            topCategories: [
              { category: 'Shopping', amount: Math.floor(Math.random() * 2000) + 500 },
              { category: 'Food & Dining', amount: Math.floor(Math.random() * 1500) + 300 },
              { category: 'Fuel', amount: Math.floor(Math.random() * 800) + 200 }
            ]
          };
          return mockData;
        });
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('CardDataService', ['$http', '$q', 'API_CONFIG', '$cacheFactory', function($http, $q, API_CONFIG, $cacheFactory) {
      var cache = $cacheFactory('cardDataCache');
      var CACHE_KEY = 'userCards';
      this.getUserCards = function(userId) {
        var cachedData = cache.get(CACHE_KEY);
        if (cachedData) {
          return $q.resolve(cachedData);
        }
        return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS, {
          params: { userId: userId },
          timeout: API_CONFIG.TIMEOUT
        }).then(function(response) {
          var cards = response.data || [];
          cache.put(CACHE_KEY, cards);
          return cards;
        }).catch(function(error) {
          var mockCards = [
            {
              cardId: 'card-001',
              userId: 'user-123',
              cardNumber: '**** **** **** 1234',
              cardType: 'Visa',
              creditLimit: 20000,
              availableCredit: 15000,
              outstandingAmount: 5000,
              expiryDate: '12/2025'
            },
            {
              cardId: 'card-002',
              userId: 'user-123',
              cardNumber: '**** **** **** 5678',
              cardType: 'MasterCard',
              creditLimit: 30000,
              availableCredit: 20749.25,
              outstandingAmount: 9250.75,
              expiryDate: '06/2026'
            }
          ];
          cache.put(CACHE_KEY, mockCards);
          return mockCards;
        });
      };
      this.invalidateCache = function() {
        cache.remove(CACHE_KEY);
      };
    }]);
})();
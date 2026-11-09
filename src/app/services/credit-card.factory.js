(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardFactory', ['$http', '$q', '$cacheFactory', function($http, $q, $cacheFactory) {
      var cache = $cacheFactory('creditCardCache');
      var CACHE_KEY = 'creditCards';
      var CACHE_TTL = 60000;
      return {
        fetchCreditCards: function() {
          var cached = cache.get(CACHE_KEY);
          if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return $q.resolve(cached.data);
          }
          return $http.get('/api/creditcards')
            .then(function(response) {
              var cards = response.data || generateMockCards();
              cache.put(CACHE_KEY, { data: cards, timestamp: Date.now() });
              return cards;
            })
            .catch(function(error) {
              console.warn('API call failed, using mock data', error);
              return generateMockCards();
            });
        }
      };
      function generateMockCards() {
        return [
          {
            cardId: 'card-001',
            cardNumber: '**** **** **** 1234',
            cardType: 'Visa Platinum',
            creditLimit: 50000,
            availableCredit: 35000,
            outstandingAmount: 15000,
            monthlySpend: 8500
          },
          {
            cardId: 'card-002',
            cardNumber: '**** **** **** 5678',
            cardType: 'Mastercard Gold',
            creditLimit: 30000,
            availableCredit: 22000,
            outstandingAmount: 8000,
            monthlySpend: 5200
          },
          {
            cardId: 'card-003',
            cardNumber: '**** **** **** 9012',
            cardType: 'Amex Premium',
            creditLimit: 75000,
            availableCredit: 60000,
            outstandingAmount: 15000,
            monthlySpend: 12300
          }
        ];
      }
    }]);
})();
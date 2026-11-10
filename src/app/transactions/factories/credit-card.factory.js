(function() {
  'use strict';
  angular.module('transactionModule').factory('CreditCardFactory', ['$cacheFactory', function($cacheFactory) {
    const cache = $cacheFactory('cardCache');
    const mockCards = {
      'CC001': { cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa' },
      'CC002': { cardId: 'CC002', cardNumber: '**** 5678', cardType: 'Mastercard' },
      'CC003': { cardId: 'CC003', cardNumber: '**** 9012', cardType: 'Amex' }
    };
    return {
      getCardById: function(cardId) {
        let card = cache.get(cardId);
        if (!card) {
          card = mockCards[cardId] || { cardId: cardId, cardNumber: 'Unknown', cardType: 'Unknown' };
          cache.put(cardId, card);
        }
        return card;
      }
    };
  }]);
})();
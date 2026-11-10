(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('creditCardService', ['$http', '$q', function($http, $q) {
      var cache = null;
      var mockCards = [
        {cardId: 'CC001', cardName: 'Platinum Rewards', cardType: 'Credit', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500, lastUpdated: new Date(), lastFourDigits: '4521'},
        {cardId: 'CC002', cardName: 'Gold Cashback', cardType: 'Credit', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200, lastUpdated: new Date(), lastFourDigits: '7834'},
        {cardId: 'CC003', cardName: 'Travel Elite', cardType: 'Credit', creditLimit: 75000, availableCredit: 60000, outstandingAmount: 15000, monthlySpend: 12300, lastUpdated: new Date(), lastFourDigits: '2109'}
      ];
      return {
        getAllCards: function() {
          if (cache) {
            return $q.resolve(cache);
          }
          return $q.resolve(mockCards).then(function(data) {
            cache = data;
            return data;
          });
        },
        getCardDetails: function(cardId) {
          return $q.resolve(mockCards.find(function(c) { return c.cardId === cardId; }));
        },
        invalidateCache: function() {
          cache = null;
        }
      };
    }]);
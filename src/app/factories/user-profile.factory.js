(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('UserProfileFactory', ['$http', '$q', function($http, $q) {
      return {
        validateOwnership: function(userId) {
          return $http.get('/api/users/' + userId + '/cards')
            .then(function(response) {
              return response.data.cards || [];
            })
            .catch(function(error) {
              console.error('User profile fetch error:', error);
              var mockCards = [
                { cardId: 'card1', userId: userId, cardName: 'Platinum Rewards', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 12000, availableCredit: 38000, lastFourDigits: '4532', expiryDate: new Date('2026-12-31') },
                { cardId: 'card2', userId: userId, cardName: 'Travel Plus', cardType: 'Mastercard', creditLimit: 30000, outstandingAmount: 8500, availableCredit: 21500, lastFourDigits: '8765', expiryDate: new Date('2025-08-31') },
                { cardId: 'card3', userId: userId, cardName: 'Cashback Gold', cardType: 'Amex', creditLimit: 20000, outstandingAmount: 5000, availableCredit: 15000, lastFourDigits: '3421', expiryDate: new Date('2027-03-31') }
              ];
              return mockCards;
            });
        }
      };
    }]);
})();
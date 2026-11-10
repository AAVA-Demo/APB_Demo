(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('CreditCardDataFactory', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      return {
        getCardDetails: function(cardId) {
          return $http.get(API_ENDPOINTS.cards + '/' + cardId)
            .then(function(response) {
              return response.data;
            })
            .catch(function() {
              var mockCards = {
                'card-001': { cardId: 'card-001', userId: 'user-001', cardType: 'Visa', issuer: 'Bank A', lastFourDigits: '1234', expiryDate: new Date('2026-12-31'), creditLimit: 10000, availableCredit: 8749.50, outstandingBalance: 1250.50, monthlySpend: 1250.50, metadata: { rewardsProgram: 'Cashback' } },
                'card-002': { cardId: 'card-002', userId: 'user-001', cardType: 'Mastercard', issuer: 'Bank B', lastFourDigits: '5678', expiryDate: new Date('2027-06-30'), creditLimit: 15000, availableCredit: 14109.75, outstandingBalance: 890.25, monthlySpend: 890.25, metadata: { rewardsProgram: 'Travel Points' } },
                'card-003': { cardId: 'card-003', userId: 'user-001', cardType: 'Amex', issuer: 'Bank C', lastFourDigits: '9012', expiryDate: new Date('2025-09-30'), creditLimit: 20000, availableCredit: 17900.00, outstandingBalance: 2100.00, monthlySpend: 2100.00, metadata: { rewardsProgram: 'Premium Rewards' } }
              };
              return mockCards[cardId] || {};
            });
        }
      };
    }]);
})();
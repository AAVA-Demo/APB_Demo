(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      this.getCards = function(page, limit) {
        page = page || 1;
        limit = limit || 10;
        return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?page=' + page + '&limit=' + limit)
          .then(function(response) {
            return response.data.cards || [];
          })
          .catch(function() {
            return [
              {cardId: 'c1', cardNumber: '**** **** **** 1234', cardType: 'Visa Platinum', bankName: 'HDFC Bank', creditLimit: 100000, availableCredit: 72000, outstandingAmount: 28000, status: 'Active', expiryDate: '2027-12-31'},
              {cardId: 'c2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard Gold', bankName: 'ICICI Bank', creditLimit: 80000, availableCredit: 65000, outstandingAmount: 15000, status: 'Active', expiryDate: '2026-08-31'},
              {cardId: 'c3', cardNumber: '**** **** **** 9012', cardType: 'Amex Platinum', bankName: 'American Express', creditLimit: 150000, availableCredit: 120000, outstandingAmount: 30000, status: 'Active', expiryDate: '2028-03-31'}
            ];
          });
      };
      this.getCardSpending = function(cardId) {
        var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.cardSpending.replace(':cardId', cardId);
        return $http.get(url)
          .then(function(response) {
            return response.data;
          })
          .catch(function() {
            return {
              cardId: cardId,
              monthlySpend: 15420,
              categoryBreakdown: [
                {category: 'Food & Dining', amount: 4500},
                {category: 'Fuel', amount: 3200},
                {category: 'Shopping', amount: 5720},
                {category: 'Entertainment', amount: 2000}
              ],
              lastTransactionDate: new Date()
            };
          });
      };
    }]);
})();
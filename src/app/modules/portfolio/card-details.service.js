(function() {
  'use strict';
  angular.module('creditCard.portfolio')
    .service('CardDetailsService', ['$http', '$q', 'UserProfileFactory', function($http, $q, UserProfileFactory) {
      this.getCardsByUser = function(userId) {
        var deferred = $q.defer();
        var mockCards = [
          { cardId: 'card1', cardNumber: '**** 1234', cardType: 'Visa', cardHolderName: 'John Doe', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, expiryDate: '2026-12', isActive: true },
          { cardId: 'card2', cardNumber: '**** 5678', cardType: 'MasterCard', cardHolderName: 'John Doe', creditLimit: 30000, availableCredit: 20000, outstandingAmount: 10000, expiryDate: '2025-08', isActive: true },
          { cardId: 'card3', cardNumber: '**** 9012', cardType: 'Amex', cardHolderName: 'John Doe', creditLimit: 70000, availableCredit: 50000, outstandingAmount: 20000, expiryDate: '2027-03', isActive: true },
          { cardId: 'card4', cardNumber: '**** 3456', cardType: 'Visa', cardHolderName: 'John Doe', creditLimit: 40000, availableCredit: 30000, outstandingAmount: 10000, expiryDate: '2026-06', isActive: true },
          { cardId: 'card5', cardNumber: '**** 7890', cardType: 'MasterCard', cardHolderName: 'John Doe', creditLimit: 60000, availableCredit: 45000, outstandingAmount: 15000, expiryDate: '2028-01', isActive: true }
        ];
        setTimeout(function() {
          deferred.resolve(mockCards);
        }, 800);
        return deferred.promise;
      };
    }]);
})();
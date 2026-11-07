(function() {
  'use strict';
  angular.module('creditCardApp').factory('CreditCardDataFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    var mockCards = [
      {cardId: 'CC001', cardNumber: '**** **** **** 1234', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, cardHolderName: 'John Doe', expiryDate: '12/2025'},
      {cardId: 'CC002', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', creditLimit: 75000, outstandingAmount: 25000, availableCredit: 50000, cardHolderName: 'John Doe', expiryDate: '06/2026'},
      {cardId: 'CC003', cardNumber: '**** **** **** 9012', cardType: 'Amex', creditLimit: 100000, outstandingAmount: 30000, availableCredit: 70000, cardHolderName: 'John Doe', expiryDate: '03/2027'}
    ];
    return {
      getAllCards: function() {
        var deferred = $q.defer();
        setTimeout(function() {
          deferred.resolve(angular.copy(mockCards));
        }, 300);
        return deferred.promise;
      }
    };
  }]);
})();
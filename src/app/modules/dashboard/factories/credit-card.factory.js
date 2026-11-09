(function() {
  'use strict';
  angular.module('creditCard.dashboard').factory('CreditCardFactory', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var mockCards = [
      {cardId: 'c1', cardNumber: '**** **** **** 1234', cardType: 'Visa', creditLimit: 100000, currentBalance: 35000},
      {cardId: 'c2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', creditLimit: 150000, currentBalance: 48000},
      {cardId: 'c3', cardNumber: '**** **** **** 9012', cardType: 'Amex', creditLimit: 200000, currentBalance: 72000}
    ];
    return {
      getAllCards: function() {
        var deferred = $q.defer();
        setTimeout(function() {
          deferred.resolve(mockCards);
        }, 500);
        return deferred.promise;
      }
    };
  }]);
})();
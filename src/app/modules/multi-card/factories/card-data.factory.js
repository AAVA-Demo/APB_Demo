(function() {
  'use strict';
  angular.module('creditCard.multiCard').factory('CardDataFactory', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var mockCards = [
      {cardId: 'c1', cardNumber: '**** **** **** 1234', cardType: 'Visa', creditLimit: 100000, outstandingBalance: 35000},
      {cardId: 'c2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', creditLimit: 150000, outstandingBalance: 48000},
      {cardId: 'c3', cardNumber: '**** **** **** 9012', cardType: 'Amex', creditLimit: 200000, outstandingBalance: 72000}
    ];
    return {
      fetchUserCards: function() {
        var deferred = $q.defer();
        setTimeout(function() {
          deferred.resolve(mockCards);
        }, 600);
        return deferred.promise;
      }
    };
  }]);
})();
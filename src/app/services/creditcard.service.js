(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardService', ['$http', '$q', function($http, $q) {
    var service = this;
    var mockCards = [
      {cardId: 'c1', cardNumber: '****1234', cardType: 'Visa', creditLimit: 10000, outstandingAmount: 2500, availableCredit: 7500},
      {cardId: 'c2', cardNumber: '****5678', cardType: 'MasterCard', creditLimit: 15000, outstandingAmount: 5000, availableCredit: 10000}
    ];

    service.getCards = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(mockCards);
        }, 500);
      });
    };
  }]);
})();
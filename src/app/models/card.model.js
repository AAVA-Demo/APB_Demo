(function() {
  'use strict';
  angular.module('creditCardApp').factory('Card', [function() {
    function Card(data) {
      this.id = data.id;
      this.cardNumber = data.cardNumber;
      this.issuer = data.issuer;
      this.cardType = data.cardType;
      this.creditLimit = data.creditLimit;
      this.currentBalance = data.currentBalance;
      this.outstandingAmount = data.outstandingAmount;
      this.monthlySpend = data.monthlySpend;
      this.availableCredit = data.creditLimit - data.currentBalance;
    }
    return Card;
  }]);
})();
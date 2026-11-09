(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardApiService', ['$http', '$q', function($http, $q) {
    const BASE_URL = '/api/creditcards';
    this.getAllCards = function() {
      const mockData = [
        {cardId: 'CC001', cardNumber: '**** **** **** 1234', cardType: 'Visa Platinum', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, monthlySpend: 8200},
        {cardId: 'CC002', cardNumber: '**** **** **** 5678', cardType: 'Mastercard Gold', creditLimit: 30000, outstandingAmount: 5000, availableCredit: 25000, monthlySpend: 4500},
        {cardId: 'CC003', cardNumber: '**** **** **** 9012', cardType: 'Amex Blue', creditLimit: 75000, outstandingAmount: 22000, availableCredit: 53000, monthlySpend: 15300}
      ];
      return $q.resolve(mockData);
    };
  }]);
})();
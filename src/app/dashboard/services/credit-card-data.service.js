(function() {
  'use strict';
  angular.module('dashboardModule').service('CreditCardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    this.getAllCards = function() {
      const deferred = $q.defer();
      const mockCards = [
        { cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 12500, availableCredit: 37500, monthlySpend: 8200 },
        { cardId: 'CC002', cardNumber: '**** 5678', cardType: 'Mastercard', creditLimit: 75000, outstandingAmount: 22000, availableCredit: 53000, monthlySpend: 15300 },
        { cardId: 'CC003', cardNumber: '**** 9012', cardType: 'Amex', creditLimit: 100000, outstandingAmount: 35000, availableCredit: 65000, monthlySpend: 21500 }
      ];
      deferred.resolve(mockCards);
      return deferred.promise;
    };
  }]);
})();
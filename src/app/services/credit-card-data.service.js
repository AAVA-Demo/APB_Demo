(function() {
  'use strict';
  angular.module('portfolio')
    .service('CreditCardDataService', ['$q', function($q) {
      const mockCards = [
        {
          cardId: 'CC001',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa',
          cardHolderName: 'John Doe',
          totalCreditLimit: 10000,
          outstandingAmount: 2500,
          monthlySpend: 1200,
          expiryDate: '12/25',
          status: 'Active'
        },
        {
          cardId: 'CC002',
          cardNumber: '**** **** **** 5678',
          cardType: 'MasterCard',
          cardHolderName: 'John Doe',
          totalCreditLimit: 15000,
          outstandingAmount: 5000,
          monthlySpend: 2300,
          expiryDate: '06/26',
          status: 'Active'
        },
        {
          cardId: 'CC003',
          cardNumber: '**** **** **** 9012',
          cardType: 'Amex',
          cardHolderName: 'John Doe',
          totalCreditLimit: 20000,
          outstandingAmount: 8000,
          monthlySpend: 3500,
          expiryDate: '03/27',
          status: 'Active'
        }
      ];
      this.fetchAllCards = function() {
        return $q.resolve(mockCards);
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .run(['$httpBackend', function($httpBackend) {
      var mockCards = [
        { cardId: 'c1', cardNumber: '**** **** **** 1234', cardType: 'Visa', bankName: 'Chase Bank', balance: 1250.50, creditLimit: 5000, availableCredit: 3749.50, monthlySpend: 450.25 },
        { cardId: 'c2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', bankName: 'Bank of America', balance: 2100.75, creditLimit: 10000, availableCredit: 7899.25, monthlySpend: 680.50 },
        { cardId: 'c3', cardNumber: '**** **** **** 9012', cardType: 'Amex', bankName: 'American Express', balance: 500.00, creditLimit: 3000, availableCredit: 2500.00, monthlySpend: 200.00 }
      ];
      var mockTransactions = [
        { transactionId: 't1', amount: 45.50, date: new Date('2024-01-15'), merchant: 'Restaurant ABC', category: 'Food & Dining', cardId: 'c1' },
        { transactionId: 't2', amount: 60.00, date: new Date('2024-01-18'), merchant: 'Gas Station', category: 'Fuel', cardId: 'c1' },
        { transactionId: 't3', amount: 120.00, date: new Date('2024-01-20'), merchant: 'Online Store', category: 'Shopping', cardId: 'c2' },
        { transactionId: 't4', amount: 250.00, date: new Date('2024-01-22'), merchant: 'Airline', category: 'Travel', cardId: 'c2' },
        { transactionId: 't5', amount: 35.00, date: new Date('2024-01-25'), merchant: 'Movie Theater', category: 'Entertainment', cardId: 'c3' }
      ];
      $httpBackend.whenGET(/\/api\/creditcards\?userId=.*/).respond(mockCards);
      $httpBackend.whenGET(/\/api\/cards\?userId=.*/).respond(mockCards);
      $httpBackend.whenGET(/\/api\/user\/validate\?userId=.*/).respond({ valid: true });
      $httpBackend.whenGET(/\/api\/transactions\/summary\?cardId=.*/).respond({ monthlySpend: 450.25, trends: [{ month: 'Jan', amount: 450.25 }, { month: 'Dec', amount: 380.00 }] });
      $httpBackend.whenGET(/\/api\/transactions\?userId=.*/).respond(mockTransactions);
      $httpBackend.whenGET(/\/api\/dashboard\/metrics\?userId=.*/).respond({ totalSpend: 1330.75, avgMonthly: 443.58 });
      $httpBackend.whenGET(/src\/app\//).passThrough();
    }]);
})();
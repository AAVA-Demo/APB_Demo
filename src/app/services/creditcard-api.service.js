(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardApiService', ['$http', '$q', function($http, $q) {
      var mockCards = [
        {
          cardId: 'card001',
          userId: 'user123',
          cardNumber: '**** **** **** 1234',
          cardHolderName: 'John Doe',
          cardType: 'Visa',
          creditLimit: 10000,
          currentBalance: 3500,
          availableCredit: 6500,
          outstandingAmount: 3500,
          expiryDate: '12/25',
          status: 'Active',
          lastUpdated: new Date(),
          transactions: [
            { transactionId: 'txn001', cardId: 'card001', amount: 150, category: 'Food & Dining', date: new Date(2024, 10, 15), description: 'Restaurant', merchantName: 'Italian Bistro', status: 'Posted' },
            { transactionId: 'txn002', cardId: 'card001', amount: 80, category: 'Fuel', date: new Date(2024, 10, 20), description: 'Gas Station', merchantName: 'Shell', status: 'Posted' },
            { transactionId: 'txn003', cardId: 'card001', amount: 200, category: 'Shopping', date: new Date(2024, 10, 22), description: 'Online Shopping', merchantName: 'Amazon', status: 'Pending' }
          ]
        },
        {
          cardId: 'card002',
          userId: 'user123',
          cardNumber: '**** **** **** 5678',
          cardHolderName: 'John Doe',
          cardType: 'Mastercard',
          creditLimit: 15000,
          currentBalance: 5000,
          availableCredit: 10000,
          outstandingAmount: 5000,
          expiryDate: '06/26',
          status: 'Active',
          lastUpdated: new Date(),
          transactions: [
            { transactionId: 'txn004', cardId: 'card002', amount: 500, category: 'Travel', date: new Date(2024, 10, 10), description: 'Flight Booking', merchantName: 'Airlines', status: 'Posted' },
            { transactionId: 'txn005', cardId: 'card002', amount: 100, category: 'Entertainment', date: new Date(2024, 10, 18), description: 'Movie Tickets', merchantName: 'Cinema', status: 'Posted' }
          ]
        },
        {
          cardId: 'card003',
          userId: 'user123',
          cardNumber: '**** **** **** 9012',
          cardHolderName: 'John Doe',
          cardType: 'Amex',
          creditLimit: 20000,
          currentBalance: 8000,
          availableCredit: 12000,
          outstandingAmount: 8000,
          expiryDate: '03/27',
          status: 'Active',
          lastUpdated: new Date(),
          transactions: [
            { transactionId: 'txn006', cardId: 'card003', amount: 300, category: 'Healthcare', date: new Date(2024, 10, 5), description: 'Medical Checkup', merchantName: 'Hospital', status: 'Posted' },
            { transactionId: 'txn007', cardId: 'card003', amount: 250, category: 'Utilities', date: new Date(2024, 10, 12), description: 'Electricity Bill', merchantName: 'Utility Co', status: 'Posted' },
            { transactionId: 'txn008', cardId: 'card003', amount: 400, category: 'Education', date: new Date(2024, 9, 28), description: 'Course Fee', merchantName: 'University', status: 'Posted' }
          ]
        }
      ];
      this.fetchAllCards = function(userId) {
        return $q.resolve(mockCards.filter(function(card) { return card.userId === userId; }));
      };
    }]);
})();
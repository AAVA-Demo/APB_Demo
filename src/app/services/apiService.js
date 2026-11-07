(function() {
  'use strict';
  angular.module('ccApp').service('ApiService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var self = this;
    var baseUrl = 'https://api.creditcard-demo.com';
    var mockData = {
      creditCards: [
        { id: '1', cardNumber: '**** **** **** 1234', cardName: 'Visa Platinum', cardType: 'Visa', creditLimit: 10000, availableCredit: 7500, outstandingAmount: 2500, monthlySpend: 1200, dueDate: '2024-02-15', status: 'active' },
        { id: '2', cardNumber: '**** **** **** 5678', cardName: 'MasterCard Gold', cardType: 'MasterCard', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000, monthlySpend: 1800, dueDate: '2024-02-20', status: 'active' },
        { id: '3', cardNumber: '**** **** **** 9012', cardName: 'Amex Blue', cardType: 'Amex', creditLimit: 20000, availableCredit: 18000, outstandingAmount: 2000, monthlySpend: 900, dueDate: '2024-02-25', status: 'active' }
      ],
      transactions: [
        { id: 't1', cardId: '1', date: '2024-01-15', merchant: 'Whole Foods', amount: 125.50, currency: 'USD', category: 'Food & Dining', description: 'Groceries', status: 'posted', cardLast4: '1234' },
        { id: 't2', cardId: '1', date: '2024-01-16', merchant: 'Shell Gas Station', amount: 45.00, currency: 'USD', category: 'Fuel', description: 'Gas', status: 'posted', cardLast4: '1234' },
        { id: 't3', cardId: '2', date: '2024-01-17', merchant: 'Amazon', amount: 299.99, currency: 'USD', category: 'Shopping', description: 'Electronics', status: 'posted', cardLast4: '5678' },
        { id: 't4', cardId: '2', date: '2024-01-18', merchant: 'Delta Airlines', amount: 450.00, currency: 'USD', category: 'Travel', description: 'Flight ticket', status: 'posted', cardLast4: '5678' },
        { id: 't5', cardId: '3', date: '2024-01-19', merchant: 'Netflix', amount: 15.99, currency: 'USD', category: 'Entertainment', description: 'Subscription', status: 'posted', cardLast4: '9012' },
        { id: 't6', cardId: '1', date: '2024-01-20', merchant: 'Electric Company', amount: 85.00, currency: 'USD', category: 'Utilities', description: 'Bill payment', status: 'posted', cardLast4: '1234' },
        { id: 't7', cardId: '3', date: '2024-01-21', merchant: 'CVS Pharmacy', amount: 35.50, currency: 'USD', category: 'Healthcare', description: 'Medicine', status: 'posted', cardLast4: '9012' },
        { id: 't8', cardId: '2', date: '2024-01-22', merchant: 'Coursera', amount: 49.00, currency: 'USD', category: 'Education', description: 'Online course', status: 'posted', cardLast4: '5678' },
        { id: 't9', cardId: '1', date: '2024-01-23', merchant: 'Starbucks', amount: 12.50, currency: 'USD', category: 'Food & Dining', description: 'Coffee', status: 'posted', cardLast4: '1234' },
        { id: 't10', cardId: '3', date: '2024-01-24', merchant: 'Target', amount: 78.25, currency: 'USD', category: 'Shopping', description: 'Household items', status: 'posted', cardLast4: '9012' }
      ],
      analytics: {
        categorySpend: [
          { category: 'Food & Dining', amount: 138.00, percentage: 12.5 },
          { category: 'Fuel', amount: 45.00, percentage: 4.1 },
          { category: 'Shopping', amount: 378.24, percentage: 34.3 },
          { category: 'Travel', amount: 450.00, percentage: 40.8 },
          { category: 'Entertainment', amount: 15.99, percentage: 1.4 },
          { category: 'Utilities', amount: 85.00, percentage: 7.7 },
          { category: 'Healthcare', amount: 35.50, percentage: 3.2 },
          { category: 'Education', amount: 49.00, percentage: 4.4 },
          { category: 'Miscellaneous', amount: 0, percentage: 0 }
        ],
        monthlyTrend: [
          { month: 'Aug 2023', totalSpend: 2800 },
          { month: 'Sep 2023', totalSpend: 3200 },
          { month: 'Oct 2023', totalSpend: 2900 },
          { month: 'Nov 2023', totalSpend: 3500 },
          { month: 'Dec 2023', totalSpend: 4200 },
          { month: 'Jan 2024', totalSpend: 3900 }
        ],
        cardWiseSpend: [
          { cardId: '1', cardName: 'Visa Platinum', totalSpend: 1200 },
          { cardId: '2', cardName: 'MasterCard Gold', totalSpend: 1800 },
          { cardId: '3', cardName: 'Amex Blue', totalSpend: 900 }
        ],
        totalSpend: 3900,
        periodStart: '2024-01-01',
        periodEnd: '2024-01-31'
      }
    };
    self.get = function(endpoint, params) {
      var deferred = $q.defer();
      setTimeout(function() {
        if (endpoint.includes('/creditcards')) {
          deferred.resolve({ data: mockData.creditCards });
        } else if (endpoint.includes('/transactions')) {
          var filtered = mockData.transactions;
          if (params && params.cardId) {
            filtered = filtered.filter(function(t) { return t.cardId === params.cardId; });
          }
          if (params && params.category) {
            filtered = filtered.filter(function(t) { return t.category === params.category; });
          }
          deferred.resolve({ data: filtered });
        } else if (endpoint.includes('/analytics/spending')) {
          deferred.resolve({ data: mockData.analytics });
        } else {
          deferred.reject({ status: 404, message: 'Endpoint not found' });
        }
      }, 300);
      return deferred.promise;
    };
    self.post = function(endpoint, data) {
      return $q.resolve({ data: { success: true } });
    };
  }]);
})();
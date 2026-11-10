(function() {
  'use strict';
  angular.module('transactionModule').service('TransactionService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    const self = this;
    const API_BASE = '/api/transactions';
    let lastRequest = null;
    self.getTransactions = function(page, filters) {
      const params = {
        page: page || 1,
        pageSize: 20
      };
      if (filters) {
        if (filters.cardId) params.cardId = filters.cardId;
        if (filters.dateRange) params.dateRange = filters.dateRange;
        if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      }
      return $http.get(API_BASE, { params: params }).then(function(response) {
        lastRequest = response.data;
        return response.data;
      }).catch(function(error) {
        if (lastRequest) {
          return $q.resolve(lastRequest);
        }
        return $q.reject(error);
      });
    };
    self.getMockTransactions = function(page, filters) {
      const allTransactions = [
        { transactionId: '1', cardId: '1', cardName: 'Visa Platinum', merchant: 'Amazon', amount: 2500, date: new Date('2024-01-15'), category: 'Shopping', status: 'Posted' },
        { transactionId: '2', cardId: '1', cardName: 'Visa Platinum', merchant: 'Swiggy', amount: 450, date: new Date('2024-01-14'), category: 'Food & Dining', status: 'Posted' },
        { transactionId: '3', cardId: '2', cardName: 'MasterCard Gold', merchant: 'Shell Petrol', amount: 3000, date: new Date('2024-01-13'), category: 'Fuel', status: 'Posted' },
        { transactionId: '4', cardId: '1', cardName: 'Visa Platinum', merchant: 'BookMyShow', amount: 800, date: new Date('2024-01-12'), category: 'Entertainment', status: 'Posted' },
        { transactionId: '5', cardId: '3', cardName: 'Amex Blue', merchant: 'MakeMyTrip', amount: 15000, date: new Date('2024-01-11'), category: 'Travel', status: 'Posted' },
        { transactionId: '6', cardId: '2', cardName: 'MasterCard Gold', merchant: 'Apollo Pharmacy', amount: 1200, date: new Date('2024-01-10'), category: 'Healthcare', status: 'Posted' },
        { transactionId: '7', cardId: '1', cardName: 'Visa Platinum', merchant: 'Electricity Bill', amount: 2000, date: new Date('2024-01-09'), category: 'Utilities', status: 'Posted' },
        { transactionId: '8', cardId: '3', cardName: 'Amex Blue', merchant: 'Coursera', amount: 3500, date: new Date('2024-01-08'), category: 'Education', status: 'Posted' },
        { transactionId: '9', cardId: '2', cardName: 'MasterCard Gold', merchant: 'Zomato', amount: 650, date: new Date('2024-01-07'), category: 'Food & Dining', status: 'Posted' },
        { transactionId: '10', cardId: '1', cardName: 'Visa Platinum', merchant: 'Flipkart', amount: 4500, date: new Date('2024-01-06'), category: 'Shopping', status: 'Pending' }
      ];
      let filtered = allTransactions;
      if (filters && filters.cardId) {
        filtered = filtered.filter(function(t) { return t.cardId === filters.cardId; });
      }
      if (filters && filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(function(t) { return t.merchant.toLowerCase().includes(term); });
      }
      const start = (page - 1) * 20;
      const end = start + 20;
      return $q.resolve({
        transactions: filtered.slice(start, end),
        totalCount: filtered.length,
        page: page,
        pageSize: 20
      });
    };
  }]);
})();
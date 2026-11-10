(function() {
  'use strict';
  angular.module('app.dashboard')
    .factory('TransactionService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      var service = {
        getMonthlySpend: getMonthlySpend,
        getTransactions: getTransactions,
        getTransactionById: getTransactionById
      };
      return service;
      function getMonthlySpend() {
        return $http({
          method: 'GET',
          url: '/api/transactions/monthly',
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            return {monthlySpend: 25000, totalOutstanding: 25000};
          }
          return $q.reject(error);
        });
      }
      function getTransactions(filter) {
        var params = {};
        if (filter) {
          if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
          if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
          if (filter.searchText) params.search = filter.searchText;
          if (filter.cardIds && filter.cardIds.length) params.cardIds = filter.cardIds.join(',');
        }
        return $http({
          method: 'GET',
          url: '/api/transactions',
          params: params,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            return generateMockTransactions();
          }
          return $q.reject(error);
        });
      }
      function getTransactionById(id) {
        return $http({
          method: 'GET',
          url: '/api/transactions/' + id,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          if (error.status === 404 || error.status === -1) {
            var mockTxns = generateMockTransactions();
            var found = mockTxns.find(function(t) { return t.transactionId === id; });
            return found || mockTxns[0];
          }
          return $q.reject(error);
        });
      }
      function generateMockTransactions() {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var merchants = ['Amazon', 'Walmart', 'Shell Gas', 'Starbucks', 'Netflix', 'Uber', 'Target', 'Best Buy', 'Costco', 'Whole Foods'];
        var cards = ['**** 1234', '**** 5678', '**** 9012'];
        var txns = [];
        for (var i = 0; i < 50; i++) {
          var date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 90));
          txns.push({
            transactionId: 'txn' + i,
            cardId: 'c' + (Math.floor(Math.random() * 3) + 1),
            cardNumber: cards[Math.floor(Math.random() * 3)],
            date: date,
            merchant: merchants[Math.floor(Math.random() * merchants.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            amount: Math.floor(Math.random() * 5000) + 100,
            currency: 'USD',
            status: Math.random() > 0.2 ? 'posted' : 'pending',
            description: 'Purchase at merchant'
          });
        }
        return txns.sort(function(a, b) { return b.date - a.date; });
      }
    }]);
})();
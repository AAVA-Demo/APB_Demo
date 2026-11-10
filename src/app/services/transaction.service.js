(function() {
  'use strict';
  angular.module('creditCardApp').service('TransactionService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var self = this;
    self.getTransactions = function(filterParams) {
      var params = filterParams || {};
      var queryString = Object.keys(params).map(function(key) {
        return key + '=' + encodeURIComponent(params[key]);
      }).join('&');
      return $http.get('/api/transactions' + (queryString ? '?' + queryString : ''), {
        headers: { 'Authorization': 'Bearer ' + AuthService.getToken() }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getTransactionById = function(transactionId) {
      return $http.get('/api/transactions/' + transactionId, {
        headers: { 'Authorization': 'Bearer ' + AuthService.getToken() }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getMockTransactions = function() {
      return $q.resolve([
        {
          transactionId: 'TXN001',
          cardId: 'CC001',
          cardName: 'Visa Platinum *1234',
          amount: 2500,
          merchant: 'Amazon',
          category: 'Shopping',
          date: new Date('2024-01-15'),
          description: 'Online purchase',
          status: 'Completed'
        },
        {
          transactionId: 'TXN002',
          cardId: 'CC001',
          cardName: 'Visa Platinum *1234',
          amount: 1200,
          merchant: 'Starbucks',
          category: 'Food & Dining',
          date: new Date('2024-01-14'),
          description: 'Coffee and snacks',
          status: 'Completed'
        },
        {
          transactionId: 'TXN003',
          cardId: 'CC002',
          cardName: 'Mastercard Gold *5678',
          amount: 5000,
          merchant: 'Shell',
          category: 'Fuel',
          date: new Date('2024-01-13'),
          description: 'Fuel refill',
          status: 'Completed'
        },
        {
          transactionId: 'TXN004',
          cardId: 'CC001',
          cardName: 'Visa Platinum *1234',
          amount: 15000,
          merchant: 'Emirates',
          category: 'Travel',
          date: new Date('2024-01-10'),
          description: 'Flight booking',
          status: 'Completed'
        },
        {
          transactionId: 'TXN005',
          cardId: 'CC002',
          cardName: 'Mastercard Gold *5678',
          amount: 800,
          merchant: 'Netflix',
          category: 'Entertainment',
          date: new Date('2024-01-08'),
          description: 'Monthly subscription',
          status: 'Completed'
        }
      ]);
    };
  }]);
})();
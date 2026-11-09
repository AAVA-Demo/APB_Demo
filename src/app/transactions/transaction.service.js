(function() {
  'use strict';
  angular.module('app.transactions')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      var self = this;
      self.getTransactions = function(userId, filters, page, pageSize) {
        var params = {
          userId: userId,
          page: page || 1,
          pageSize: pageSize || 20
        };
        if (filters.selectedCards && filters.selectedCards.length > 0) {
          params.cards = filters.selectedCards.join(',');
        }
        if (filters.dateRange && filters.dateRange.from) {
          params.dateFrom = filters.dateRange.from.toISOString();
        }
        if (filters.dateRange && filters.dateRange.to) {
          params.dateTo = filters.dateRange.to.toISOString();
        }
        if (filters.searchTerm) {
          params.search = filters.searchTerm;
        }
        if (filters.category) {
          params.category = filters.category;
        }
        var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
        return $http.get(url, { params: params, timeout: API_CONFIG.timeout })
          .then(function(response) {
            return response.data || self._getMockTransactions();
          })
          .catch(function(error) {
            console.error('Transaction fetch error:', error);
            return self._getMockTransactions();
          });
      };
      self.getTransactionDetail = function(transactionId) {
        var url = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId;
        return $http.get(url, { timeout: API_CONFIG.timeout })
          .then(function(response) {
            return response.data || self._getMockTransactionDetail(transactionId);
          })
          .catch(function(error) {
            console.error('Transaction detail fetch error:', error);
            return self._getMockTransactionDetail(transactionId);
          });
      };
      self._getMockTransactions = function() {
        return {
          transactions: [
            { transactionId: 'txn1', cardId: 'card1', cardName: 'Platinum Rewards', amount: 125.50, currency: 'USD', transactionDate: new Date('2024-01-15'), merchantName: 'Grocery Store', category: 'Food & Dining', description: 'Weekly groceries', status: 'posted' },
            { transactionId: 'txn2', cardId: 'card2', cardName: 'Gold Cashback', amount: 65.00, currency: 'USD', transactionDate: new Date('2024-01-14'), merchantName: 'Gas Station', category: 'Fuel', description: 'Fuel purchase', status: 'posted' },
            { transactionId: 'txn3', cardId: 'card1', cardName: 'Platinum Rewards', amount: 450.00, currency: 'USD', transactionDate: new Date('2024-01-13'), merchantName: 'Electronics Store', category: 'Shopping', description: 'Headphones', status: 'posted' },
            { transactionId: 'txn4', cardId: 'card3', cardName: 'Travel Elite', amount: 1200.00, currency: 'USD', transactionDate: new Date('2024-01-12'), merchantName: 'Airline', category: 'Travel', description: 'Flight booking', status: 'posted' },
            { transactionId: 'txn5', cardId: 'card2', cardName: 'Gold Cashback', amount: 85.75, currency: 'USD', transactionDate: new Date('2024-01-11'), merchantName: 'Restaurant', category: 'Food & Dining', description: 'Dinner', status: 'posted' }
          ],
          totalCount: 5,
          pageSize: 20,
          currentPage: 1
        };
      };
      self._getMockTransactionDetail = function(transactionId) {
        return {
          transactionId: transactionId,
          cardId: 'card1',
          cardName: 'Platinum Rewards',
          amount: 125.50,
          currency: 'USD',
          transactionDate: new Date('2024-01-15'),
          merchantName: 'Grocery Store',
          category: 'Food & Dining',
          description: 'Weekly groceries purchase',
          status: 'posted'
        };
      };
    }]);
})();
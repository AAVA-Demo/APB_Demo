(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .service('TransactionService', ['$http', '$q', 'API_CONFIG', '$filter', TransactionService]);
  function TransactionService($http, $q, API_CONFIG, $filter) {
    const service = {
      getCurrentMonthTransactions: getCurrentMonthTransactions
    };
    return service;
    function getCurrentMonthTransactions() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: { month: 'current' }
      })
        .then(function(response) {
          return response.data || generateMockTransactions();
        })
        .catch(function() {
          return generateMockTransactions();
        });
    }
    function generateMockTransactions() {
      return [
        { id: '1', cardId: 'card1', amount: 5200, date: new Date(), merchant: 'Grocery Store', category: 'Food & Dining' },
        { id: '2', cardId: 'card1', amount: 3500, date: new Date(), merchant: 'Gas Station', category: 'Fuel' },
        { id: '3', cardId: 'card2', amount: 12000, date: new Date(), merchant: 'Online Shopping', category: 'Shopping' },
        { id: '4', cardId: 'card2', amount: 8500, date: new Date(), merchant: 'Restaurant', category: 'Food & Dining' },
        { id: '5', cardId: 'card3', amount: 25800, date: new Date(), merchant: 'Flight Booking', category: 'Travel' }
      ];
    }
  }
})();
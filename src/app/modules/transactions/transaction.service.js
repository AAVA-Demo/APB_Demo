(function() {
  'use strict';
  angular.module('creditcard.transactions')
    .service('TransactionService', ['TransactionDataFactory', '$filter', TransactionService]);
  function TransactionService(TransactionDataFactory, $filter) {
    var service = {
      getTransactions: getTransactions,
      applyFilter: applyFilter
    };
    return service;
    function getTransactions() {
      return TransactionDataFactory.fetchTransactions();
    }
    function applyFilter(transactions, filterObj) {
      var filtered = transactions;
      if (filterObj.cardId) {
        filtered = $filter('filter')(filtered, {cardId: filterObj.cardId});
      }
      if (filterObj.category) {
        filtered = $filter('filter')(filtered, {category: filterObj.category});
      }
      if (filterObj.startDate) {
        filtered = filtered.filter(function(t) {
          return new Date(t.date) >= new Date(filterObj.startDate);
        });
      }
      if (filterObj.endDate) {
        filtered = filtered.filter(function(t) {
          return new Date(t.date) <= new Date(filterObj.endDate);
        });
      }
      return filtered;
    }
  }
})();
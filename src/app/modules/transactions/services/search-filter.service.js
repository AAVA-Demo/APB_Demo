(function() {
  'use strict';
  angular.module('transactionModule')
    .service('SearchFilterService', ['$filter', function($filter) {
      this.applyFilters = function(transactions, filters) {
        let filtered = transactions;
        
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(txn => 
            (txn.merchantName && txn.merchantName.toLowerCase().includes(term)) ||
            (txn.description && txn.description.toLowerCase().includes(term)) ||
            (txn.cardName && txn.cardName.toLowerCase().includes(term))
          );
        }
        
        if (filters.cardId) {
          filtered = filtered.filter(txn => txn.cardId === filters.cardId);
        }
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          filtered = filtered.filter(txn => new Date(txn.transactionDate) >= fromDate);
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          filtered = filtered.filter(txn => new Date(txn.transactionDate) <= toDate);
        }
        
        if (filters.category) {
          filtered = filtered.filter(txn => txn.category === filters.category);
        }
        
        return filtered;
      };
    }]);
})();
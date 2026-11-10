(function() {
  'use strict';
  angular.module('creditCardApp').factory('SearchFilterService', ['$filter', function($filter) {
    var filterState = { searchText: '', selectedCard: null, dateFrom: null, dateTo: null };
    return {
      applyFilters: function(transactions) {
        var filtered = transactions;
        if (filterState.searchText) {
          filtered = $filter('filter')(filtered, filterState.searchText);
        }
        if (filterState.selectedCard) {
          filtered = filtered.filter(function(txn) { return txn.cardId === filterState.selectedCard; });
        }
        if (filterState.dateFrom) {
          filtered = filtered.filter(function(txn) {
            return new Date(txn.transactionDate) >= new Date(filterState.dateFrom);
          });
        }
        if (filterState.dateTo) {
          filtered = filtered.filter(function(txn) {
            return new Date(txn.transactionDate) <= new Date(filterState.dateTo);
          });
        }
        return filtered;
      },
      setSearchText: function(text) { filterState.searchText = text; },
      setSelectedCard: function(cardId) { filterState.selectedCard = cardId; },
      setDateRange: function(from, to) { filterState.dateFrom = from; filterState.dateTo = to; },
      getFilterState: function() { return filterState; },
      resetFilters: function() {
        filterState = { searchText: '', selectedCard: null, dateFrom: null, dateTo: null };
      }
    };
  }]);
})();
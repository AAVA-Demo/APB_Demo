(function() {
  'use strict';
  angular.module('app.transactions')
    .factory('TransactionFilterFactory', [function() {
      var filters = {
        selectedCards: [],
        dateRange: { from: null, to: null },
        searchTerm: '',
        category: ''
      };
      return {
        getFilters: function() {
          return angular.copy(filters);
        },
        setFilters: function(newFilters) {
          angular.extend(filters, newFilters);
        },
        resetFilters: function() {
          filters.selectedCards = [];
          filters.dateRange = { from: null, to: null };
          filters.searchTerm = '';
          filters.category = '';
        }
      };
    }]);
})();
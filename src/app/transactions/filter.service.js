(function() {
  'use strict';
  angular.module('app.transactions')
    .service('FilterService', [function() {
      var currentFilters = {
        startDate: null,
        endDate: null,
        cardIds: [],
        minAmount: null,
        maxAmount: null,
        searchTerm: '',
        sortBy: 'date',
        sortOrder: 'desc'
      };
      this.getFilters = function() {
        return angular.copy(currentFilters);
      };
      this.setFilters = function(filters) {
        angular.extend(currentFilters, filters);
      };
      this.resetFilters = function() {
        currentFilters = {
          startDate: null,
          endDate: null,
          cardIds: [],
          minAmount: null,
          maxAmount: null,
          searchTerm: '',
          sortBy: 'date',
          sortOrder: 'desc'
        };
      };
    }]);
})();
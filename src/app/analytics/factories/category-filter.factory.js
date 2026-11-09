(function() {
  'use strict';
  angular.module('app.analytics')
    .factory('CategoryFilterFactory', [function() {
      var filters = {
        selectedCategories: [],
        dateRange: { from: null, to: null },
        selectedCards: []
      };
      return {
        getFilters: function() {
          return angular.copy(filters);
        },
        setFilters: function(newFilters) {
          angular.extend(filters, newFilters);
        },
        resetFilters: function() {
          filters.selectedCategories = [];
          filters.dateRange = { from: null, to: null };
          filters.selectedCards = [];
        }
      };
    }]);
})();
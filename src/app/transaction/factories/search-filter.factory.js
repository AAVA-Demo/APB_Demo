(function() {
  'use strict';
  angular.module('transaction')
    .factory('SearchFilterFactory', [function() {
      return {
        createEmptyFilter: function() {
          return {
            cardId: null,
            startDate: null,
            endDate: null,
            minAmount: null,
            maxAmount: null,
            category: null,
            merchantName: null,
            transactionType: null,
            searchText: null
          };
        },
        buildQueryParams: function(filters) {
          const params = [];
          if (filters.cardId) params.push('cardId=' + filters.cardId);
          if (filters.startDate) params.push('from=' + filters.startDate);
          if (filters.endDate) params.push('to=' + filters.endDate);
          if (filters.merchantName) params.push('merchant=' + filters.merchantName);
          if (filters.category) params.push('category=' + filters.category);
          return params.join('&');
        },
        validateAndBuildFilter: function(filterInput) {
          const filter = this.createEmptyFilter();
          if (filterInput.startDate && filterInput.endDate) {
            if (new Date(filterInput.startDate) > new Date(filterInput.endDate)) {
              throw new Error('Start date must be before end date');
            }
          }
          return Object.assign(filter, filterInput);
        }
      };
    }]);
})();
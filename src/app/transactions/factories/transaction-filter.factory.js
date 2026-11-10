(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .factory('TransactionFilterFactory', function() {
      var filterState = {
        cardId: null,
        startDate: null,
        endDate: null,
        page: 1,
        pageSize: 50
      };
      return {
        getFilters: function() {
          return angular.copy(filterState);
        },
        setFilter: function(key, value) {
          if (filterState.hasOwnProperty(key)) {
            filterState[key] = value;
          }
        },
        resetFilters: function() {
          filterState.cardId = null;
          filterState.startDate = null;
          filterState.endDate = null;
          filterState.page = 1;
        }
      };
    });
})();
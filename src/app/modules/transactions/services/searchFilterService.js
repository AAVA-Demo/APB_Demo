(function() {
  'use strict';
  angular.module('transactionModule').service('SearchFilterService', ['$filter', function($filter) {
    this.buildQuery = function(filters, page, pageSize) {
      var query = {
        page: page || 1,
        size: pageSize || 25
      };
      if (filters.cardIds && filters.cardIds.length > 0) {
        query.cardIds = filters.cardIds.join(',');
      }
      if (filters.startDate) {
        query.startDate = $filter('date')(filters.startDate, 'yyyy-MM-dd');
      }
      if (filters.endDate) {
        query.endDate = $filter('date')(filters.endDate, 'yyyy-MM-dd');
      }
      if (filters.minAmount) {
        query.minAmount = filters.minAmount;
      }
      if (filters.maxAmount) {
        query.maxAmount = filters.maxAmount;
      }
      if (filters.categories && filters.categories.length > 0) {
        query.categories = filters.categories.join(',');
      }
      if (filters.merchantName) {
        query.merchantName = filters.merchantName;
      }
      return query;
    };
  }]);
})();
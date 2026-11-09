(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('SearchFilterService', ['$filter', function($filter) {
      return {
        constructQueryParams: function(filterObj) {
          var params = {};
          if (filterObj.cardId) params.cardId = filterObj.cardId;
          if (filterObj.dateFrom) params.dateFrom = $filter('date')(filterObj.dateFrom, 'yyyy-MM-dd');
          if (filterObj.dateTo) params.dateTo = $filter('date')(filterObj.dateTo, 'yyyy-MM-dd');
          if (filterObj.minAmount) params.minAmount = filterObj.minAmount;
          if (filterObj.maxAmount) params.maxAmount = filterObj.maxAmount;
          if (filterObj.merchantName) params.merchantName = filterObj.merchantName;
          if (filterObj.category) params.category = filterObj.category;
          return params;
        },
        applyClientFilter: function(transactions, filterObj) {
          var filtered = transactions;
          if (filterObj.merchantName) {
            filtered = $filter('filter')(filtered, { merchantName: filterObj.merchantName });
          }
          if (filterObj.category) {
            filtered = $filter('filter')(filtered, { category: filterObj.category });
          }
          return filtered;
        }
      };
    }]);
})();
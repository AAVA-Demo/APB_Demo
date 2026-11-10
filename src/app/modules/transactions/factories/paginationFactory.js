(function() {
  'use strict';
  angular.module('transactionModule').factory('PaginationFactory', [function() {
    return {
      create: function(pageSize) {
        return {
          currentPage: 1,
          pageSize: pageSize || 25,
          totalCount: 0,
          totalPages: 0
        };
      }
    };
  }]);
})();
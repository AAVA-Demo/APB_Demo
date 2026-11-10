(function() {
  'use strict';
  angular.module('transactionModule').factory('PaginationFactory', [function() {
    return {
      calculatePagination: function(totalCount, currentPage, pageSize) {
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
          currentPage: currentPage,
          totalPages: totalPages,
          pageSize: pageSize,
          totalCount: totalCount,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        };
      }
    };
  }]);
})();
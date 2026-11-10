(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionPagination', [transactionPagination]);
  function transactionPagination() {
    return {
      restrict: 'E',
      scope: { pagination: '=', onPageChange: '&' },
      template: '<div class="pagination" ng-if="pagination.totalPages > 1"><ul class="pagination"><li ng-class="{disabled: pagination.currentPage === 1}"><a ng-click="changePage(pagination.currentPage - 1)">&laquo;</a></li><li ng-repeat="page in pages" ng-class="{active: page === pagination.currentPage}"><a ng-click="changePage(page)">{{page}}</a></li><li ng-class="{disabled: pagination.currentPage === pagination.totalPages}"><a ng-click="changePage(pagination.currentPage + 1)">&raquo;</a></li></ul></div>',
      link: function(scope) {
        scope.changePage = function(page) {
          scope.onPageChange({ page: page });
        };
        scope.$watch('pagination.totalPages', function(totalPages) {
          scope.pages = [];
          for (var i = 1; i <= totalPages; i++) {
            scope.pages.push(i);
          }
        });
      }
    };
  }
})();
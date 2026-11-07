(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionPagination', [function() {
    return {
      restrict: 'E',
      scope: {
        pagination: '=',
        onPageChange: '&'
      },
      template: '<ul class="pagination"><li ng-class="{disabled: !pagination.hasPreviousPage}"><a href="" ng-click="goToPage(pagination.currentPage - 1)">Previous</a></li><li ng-class="{active: pagination.currentPage === page}" ng-repeat="page in pages"><a href="" ng-click="goToPage(page)">{{page}}</a></li><li ng-class="{disabled: !pagination.hasNextPage}"><a href="" ng-click="goToPage(pagination.currentPage + 1)">Next</a></li></ul>',
      link: function(scope) {
        scope.$watch('pagination', function(newVal) {
          if (newVal && newVal.totalPages) {
            scope.pages = [];
            var start = Math.max(1, newVal.currentPage - 2);
            var end = Math.min(newVal.totalPages, newVal.currentPage + 2);
            for (var i = start; i <= end; i++) {
              scope.pages.push(i);
            }
          }
        }, true);
        scope.goToPage = function(page) {
          if (page >= 1 && page <= scope.pagination.totalPages) {
            scope.onPageChange({page: page});
          }
        };
      }
    };
  }]);
})();
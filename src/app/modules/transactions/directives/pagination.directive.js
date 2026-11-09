(function() {
  'use strict';
  angular.module('transactionModule')
    .directive('pagination', [function() {
      return {
        restrict: 'E',
        scope: {
          currentPage: '=',
          totalPages: '=',
          onPageChange: '&'
        },
        template: '<nav><ul class="pagination"><li ng-class="{disabled: currentPage === 1}"><a ng-click="changePage(currentPage - 1)">&laquo;</a></li><li ng-repeat="page in pages" ng-class="{active: page === currentPage}"><a ng-click="changePage(page)">{{page}}</a></li><li ng-class="{disabled: currentPage === totalPages}"><a ng-click="changePage(currentPage + 1)">&raquo;</a></li></ul></nav>',
        link: function(scope) {
          scope.$watchGroup(['currentPage', 'totalPages'], function() {
            scope.pages = [];
            const startPage = Math.max(1, scope.currentPage - 2);
            const endPage = Math.min(scope.totalPages, scope.currentPage + 2);
            for (let i = startPage; i <= endPage; i++) {
              scope.pages.push(i);
            }
          });
          
          scope.changePage = function(page) {
            if (page >= 1 && page <= scope.totalPages && page !== scope.currentPage) {
              scope.onPageChange({ page: page });
            }
          };
        }
      };
    }]);
})();
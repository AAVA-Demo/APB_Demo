(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('txPagination', [function() {
      return {
        restrict: 'E',
        scope: {
          currentPage: '=',
          totalPages: '=',
          onPageChange: '&'
        },
        template: '<ul class="pagination">' +
                  '<li ng-class="{disabled: currentPage === 1}">' +
                  '<a href="" ng-click="goToPage(1)">&laquo; First</a>' +
                  '</li>' +
                  '<li ng-class="{disabled: currentPage === 1}">' +
                  '<a href="" ng-click="goToPage(currentPage - 1)">&lsaquo; Prev</a>' +
                  '</li>' +
                  '<li ng-repeat="page in getPages()" ng-class="{active: page === currentPage}">' +
                  '<a href="" ng-click="goToPage(page)">{{page}}</a>' +
                  '</li>' +
                  '<li ng-class="{disabled: currentPage === totalPages}">' +
                  '<a href="" ng-click="goToPage(currentPage + 1)">Next &rsaquo;</a>' +
                  '</li>' +
                  '<li ng-class="{disabled: currentPage === totalPages}">' +
                  '<a href="" ng-click="goToPage(totalPages)">Last &raquo;</a>' +
                  '</li>' +
                  '</ul>',
        link: function(scope) {
          scope.goToPage = function(page) {
            if (page >= 1 && page <= scope.totalPages && page !== scope.currentPage) {
              scope.onPageChange({ page: page });
            }
          };
          scope.getPages = function() {
            var pages = [];
            var start = Math.max(1, scope.currentPage - 2);
            var end = Math.min(scope.totalPages, scope.currentPage + 2);
            for (var i = start; i <= end; i++) {
              pages.push(i);
            }
            return pages;
          };
        }
      };
    }]);
})();
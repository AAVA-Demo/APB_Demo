(function() {
  'use strict';
  angular.module('transactions')
    .directive('pagination', [function() {
      return {
        restrict: 'E',
        scope: {
          currentPage: '=',
          totalPages: '=',
          onPageChange: '&'
        },
        template: '<div class="pagination-controls text-center">' +
                  '<button class="btn btn-default" ng-click="prev()" ng-disabled="currentPage <= 1">Previous</button> ' +
                  '<span class="pagination-info">Page {{currentPage}} of {{totalPages}}</span> ' +
                  '<button class="btn btn-default" ng-click="next()" ng-disabled="currentPage >= totalPages">Next</button>' +
                  '</div>',
        link: function(scope) {
          scope.prev = function() {
            if (scope.currentPage > 1) {
              scope.onPageChange({page: scope.currentPage - 1});
            }
          };
          scope.next = function() {
            if (scope.currentPage < scope.totalPages) {
              scope.onPageChange({page: scope.currentPage + 1});
            }
          };
        }
      };
    }]);
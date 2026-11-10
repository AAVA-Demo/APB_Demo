(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .directive('pagination', function() {
      return {
        restrict: 'E',
        scope: {
          currentPage: '=',
          totalCount: '=',
          pageSize: '=',
          onNext: '&',
          onPrev: '&'
        },
        template: '<div class="pagination-controls"><button class="btn btn-default" ng-click="onPrev()" ng-disabled="currentPage <= 1">Previous</button><span style="margin:0 15px;">Page {{currentPage}} of {{totalPages}}</span><button class="btn btn-default" ng-click="onNext()" ng-disabled="currentPage >= totalPages">Next</button></div>',
        link: function(scope) {
          scope.$watchGroup(['totalCount', 'pageSize'], function() {
            scope.totalPages = Math.ceil(scope.totalCount / scope.pageSize) || 1;
          });
        }
      };
    });
})();
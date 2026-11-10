(function() {
  'use strict';
  angular.module('app.transactions')
    .directive('transactionSearch', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        scope: {
          filter: '=',
          onSearch: '&'
        },
        template: '<div class="panel panel-default"><div class="panel-body"><div class="row"><div class="col-md-4"><label>Search:</label><input type="text" class="form-control" ng-model="filter.searchText" ng-change="triggerSearch()" placeholder="Search by merchant..."></div><div class="col-md-3"><label>From Date:</label><input type="date" class="form-control" ng-model="filter.dateFrom" ng-change="onSearch()"></div><div class="col-md-3"><label>To Date:</label><input type="date" class="form-control" ng-model="filter.dateTo" ng-change="onSearch()"></div><div class="col-md-2"><label>&nbsp;</label><button class="btn btn-primary btn-block" ng-click="onSearch()">Apply</button></div></div></div></div>',
        link: function(scope) {
          var searchTimeout;
          scope.triggerSearch = function() {
            if (searchTimeout) {
              $timeout.cancel(searchTimeout);
            }
            searchTimeout = $timeout(function() {
              scope.onSearch();
            }, 300);
          };
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardFilter', function() {
      return {
        restrict: 'E',
        scope: {
          searchText: '=',
          statusFilter: '=',
          onFilter: '&'
        },
        template: '<div class="filter-section"><div class="row"><div class="col-md-6"><input type="text" class="form-control" placeholder="Search by card number or bank..." ng-model="searchText" ng-change="onFilter()"></div><div class="col-md-6"><select class="form-control" ng-model="statusFilter" ng-change="onFilter()"><option value="All">All Status</option><option value="Active">Active</option><option value="Blocked">Blocked</option><option value="Expired">Expired</option></select></div></div></div>'
      };
    });
})();
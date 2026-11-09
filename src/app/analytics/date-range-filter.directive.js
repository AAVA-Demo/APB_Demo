(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('dateRangeFilter', function() {
      return {
        restrict: 'E',
        scope: {
          dateRange: '=',
          onUpdate: '&'
        },
        template: '<div class="filter-section">' +
                  '<div class="row">' +
                  '<div class="col-sm-5">' +
                  '<label>Start Date</label>' +
                  '<input type="date" class="form-control" ng-model="startDateModel" ng-change="updateRange()">' +
                  '</div>' +
                  '<div class="col-sm-5">' +
                  '<label>End Date</label>' +
                  '<input type="date" class="form-control" ng-model="endDateModel" ng-change="updateRange()">' +
                  '</div>' +
                  '<div class="col-sm-2">' +
                  '<label>&nbsp;</label>' +
                  '<button class="btn btn-primary btn-block" ng-click="applyFilter()">Apply</button>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.startDateModel = new Date(scope.dateRange.startDate);
          scope.endDateModel = new Date(scope.dateRange.endDate);
          scope.updateRange = function() {
            scope.dateRange.startDate = scope.startDateModel;
            scope.dateRange.endDate = scope.endDateModel;
          };
          scope.applyFilter = function() {
            scope.onUpdate({newDateRange: scope.dateRange});
          };
        }
      };
    });
})();
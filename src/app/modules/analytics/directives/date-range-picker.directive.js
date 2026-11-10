(function() {
  'use strict';
  angular.module('analytics')
    .directive('dateRangePicker', [function() {
      return {
        restrict: 'E',
        scope: {
          dateRange: '=',
          onChange: '&'
        },
        template: '<div class="form-inline">' +
                  '<div class="form-group">' +
                  '<label>Start Date:</label> ' +
                  '<input type="date" class="form-control" ng-model="dateRange.startDate" ng-change="handleChange()">' +
                  '</div> ' +
                  '<div class="form-group">' +
                  '<label>End Date:</label> ' +
                  '<input type="date" class="form-control" ng-model="dateRange.endDate" ng-change="handleChange()">' +
                  '</div>' +
                  '</div>',
        link: function(scope) {
          scope.handleChange = function() {
            if (scope.onChange) {
              scope.onChange();
            }
          };
        }
      };
    }]);
})();
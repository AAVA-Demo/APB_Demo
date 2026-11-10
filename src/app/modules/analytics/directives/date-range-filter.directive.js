(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('dateRangeFilter', function() {
      return {
        restrict: 'E',
        scope: {
          startMonth: '=',
          endMonth: '=',
          onChange: '&'
        },
        template: '<div class="form-row">' +
                  '  <div class="col">' +
                  '    <label>Start Month</label>' +
                  '    <input type="month" class="form-control" ng-model="startMonth" ng-change="applyFilter()">' +
                  '  </div>' +
                  '  <div class="col">' +
                  '    <label>End Month</label>' +
                  '    <input type="month" class="form-control" ng-model="endMonth" ng-change="applyFilter()">' +
                  '  </div>' +
                  '</div>',
        link: function(scope) {
          scope.applyFilter = function() {
            scope.onChange({
              startMonth: scope.startMonth,
              endMonth: scope.endMonth
            });
          };
        }
      };
    });
})();
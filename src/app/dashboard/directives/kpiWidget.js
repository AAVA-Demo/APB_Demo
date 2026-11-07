(function() {
  'use strict';
  angular.module('ccDashboardModule').directive('kpiWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        icon: '@',
        format: '@'
      },
      template: '<div class="kpi-widget"><i class="fa kpi-icon" ng-class="icon"></i><div class="kpi-label">{{label}}</div><div class="kpi-value">{{formattedValue}}</div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.formattedValue = '$' + (newVal || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          } else if (scope.format === 'number') {
            scope.formattedValue = (newVal || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          } else {
            scope.formattedValue = newVal || 0;
          }
        });
      }
    };
  }]);
})();
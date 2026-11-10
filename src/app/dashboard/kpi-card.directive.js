(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiCard', function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        icon: '@',
        format: '@'
      },
      template: '<div class="kpi-card"><div class="kpi-value">{{displayValue}}</div><div class="kpi-label">{{label}}</div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.displayValue = '$' + (newVal || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          } else {
            scope.displayValue = (newVal || 0).toLocaleString('en-US');
          }
        });
      }
    };
  });
})();
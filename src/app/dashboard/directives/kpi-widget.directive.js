(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          format: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-value">{{ formattedValue }}</div><div class="kpi-label">{{ label }}</div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (scope.format === 'percent') {
              scope.formattedValue = (newVal || 0) + '%';
            } else {
              scope.formattedValue = newVal || 0;
            }
          });
        }
      };
    }]);
})();
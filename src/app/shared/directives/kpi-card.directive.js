(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '=',
          value: '=',
          format: '='
        },
        template: '<div class="kpi-card">' +
                  '  <div class="kpi-label">{{label}}</div>' +
                  '  <div class="kpi-value">{{displayValue}}</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.displayValue = '$' + (newVal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
              scope.displayValue = newVal || 0;
            }
          });
        }
      };
    }]);
})();
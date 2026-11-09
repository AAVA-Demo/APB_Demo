(function() {
  'use strict';
  angular.module('creditCard.dashboard').directive('kpiWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        format: '@'
      },
      template: '<div class="kpi-card"><div class="kpi-value">{{formattedValue}}</div><div class="kpi-label">{{label}}</div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (newVal !== undefined && newVal !== null) {
            if (scope.format === 'currency') {
              scope.formattedValue = '₹' + newVal.toLocaleString('en-IN');
            } else if (scope.format === 'percentage') {
              scope.formattedValue = newVal.toFixed(2) + '%';
            } else {
              scope.formattedValue = newVal.toLocaleString('en-IN');
            }
          } else {
            scope.formattedValue = '-';
          }
        });
      }
    };
  }]);
})();
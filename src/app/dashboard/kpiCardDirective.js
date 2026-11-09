(function() {
  'use strict';
  angular.module('creditCardApp').directive('kpiCard', function() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        label: '@',
        value: '=',
        format: '@'
      },
      template: '<div class="kpi-card"><i class="{{icon}}"></i><h3>{{label}}</h3><div class="value">{{formattedValue}}</div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          } else {
            scope.formattedValue = newVal || 0;
          }
        });
      }
    };
  });
})();
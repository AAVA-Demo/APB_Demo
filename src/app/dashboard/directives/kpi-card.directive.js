(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          format: '@'
        },
        template: '<div class="kpi-card"><h3>{{title}}</h3><div class="kpi-value">{{formattedValue}}</div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (newVal !== undefined && newVal !== null) {
              if (scope.format === 'currency') {
                scope.formattedValue = '$' + newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              } else {
                scope.formattedValue = newVal.toLocaleString();
              }
            } else {
              scope.formattedValue = '--';
            }
          });
        }
      };
    }]);
})();
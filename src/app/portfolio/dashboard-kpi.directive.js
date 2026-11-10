(function() {
  'use strict';
  angular.module('app.portfolio')
    .directive('dashboardKpi', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          format: '@'
        },
        template: '<div class="kpi-widget"><div class="kpi-icon"><i class="glyphicon glyphicon-{{icon}}"></i></div><div class="kpi-content"><div class="kpi-label">{{label}}</div><div class="kpi-value">{{formattedValue}}</div></div></div>',
        link: function(scope, element, attrs) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
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
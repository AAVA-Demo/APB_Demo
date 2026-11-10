(function() {
  'use strict';
  angular.module('creditCard.dashboardModule')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          format: '@'
        },
        template: '<div class="kpi-widget">' +
                  '<h3><i class="glyphicon glyphicon-{{icon}}"></i> {{label}}</h3>' +
                  '<div class="value">{{formattedValue}}</div>' +
                  '</div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '₹' + (newVal || 0).toLocaleString('en-IN');
            } else if (scope.format === 'percentage') {
              scope.formattedValue = (newVal || 0) + '%';
            } else {
              scope.formattedValue = newVal || 0;
            }
          });
        }
      };
    }]);
})();
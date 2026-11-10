(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          format: '@'
        },
        template: '<div class="kpi-widget"><h3>{{title}}</h3><div class="value">{{formattedValue}}</div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            } else {
              scope.formattedValue = (newVal || 0).toLocaleString('en-US');
            }
          });
        }
      };
    }]);
})();
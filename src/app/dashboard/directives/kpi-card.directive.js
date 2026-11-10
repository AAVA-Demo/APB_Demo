(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          format: '@'
        },
        template: '<div class="kpi-card">' +
                  '  <i class="fa {{icon}} icon"></i>' +
                  '  <h4>{{label}}</h4>' +
                  '  <div class="value">{{formattedValue}}</div>' +
                  '</div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (newVal !== undefined && newVal !== null) {
              if (scope.format === 'currency') {
                scope.formattedValue = '$' + newVal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
              } else if (scope.format === 'percentage') {
                scope.formattedValue = newVal.toFixed(1) + '%';
              } else {
                scope.formattedValue = newVal.toLocaleString();
              }
            } else {
              scope.formattedValue = '-';
            }
          });
        }
      };
    });
})();
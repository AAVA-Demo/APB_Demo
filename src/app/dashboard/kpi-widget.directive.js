(function() {
  'use strict';
  angular.module('app.dashboard').directive('kpiWidget', kpiWidget);
  function kpiWidget() {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        value: '=',
        format: '='
      },
      template: '<div class="kpi-card">' +
                '  <div class="kpi-title">{{title}}</div>' +
                '  <div class="kpi-value">{{formattedValue}}</div>' +
                '</div>',
      link: function(scope) {
        scope.$watch('value', function(newValue) {
          if (scope.format === 'currency') {
            scope.formattedValue = '$' + (newValue || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          } else {
            scope.formattedValue = newValue || 0;
          }
        });
      }
    };
  }
})();
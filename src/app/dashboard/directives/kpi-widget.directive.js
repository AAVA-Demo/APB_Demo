(function() {
  'use strict';
  angular.module('app.dashboard').directive('kpiWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        kpiValue: '=',
        kpiLabel: '@',
        kpiIcon: '@',
        kpiFormat: '@'
      },
      template: '<div class="kpi-card">' +
                '  <div><i class="fa {{kpiIcon}} fa-2x" style="color: #007bff;"></i></div>' +
                '  <div class="kpi-value">{{formattedValue}}</div>' +
                '  <div class="kpi-label">{{kpiLabel}}</div>' +
                '</div>',
      link: function(scope) {
        scope.$watch('kpiValue', function(newVal) {
          if (scope.kpiFormat === 'currency') {
            scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            scope.formattedValue = newVal || 0;
          }
        });
      }
    };
  }]);
})();
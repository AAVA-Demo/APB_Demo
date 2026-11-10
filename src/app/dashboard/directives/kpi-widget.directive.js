(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="kpi-card">' +
                  '  <div class="kpi-value">{{ value | currency:"₹":0 }}</div>' +
                  '  <div class="kpi-label">{{ label }}</div>' +
                  '</div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-value">{{ value | currency }}</div><div class="kpi-label">{{ label }}</div></div>'
      };
    }]);
})();
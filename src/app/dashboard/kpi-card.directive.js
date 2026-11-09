(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          label: '=',
          value: '=',
          icon: '=',
          color: '='
        },
        template: '<div class="kpi-card"><div><i class="fa {{icon}} fa-2x" style="color:{{color}};"></i></div><div class="kpi-value">{{value | currency}}</div><div class="kpi-label">{{label}}</div></div>'
      };
    });
})();
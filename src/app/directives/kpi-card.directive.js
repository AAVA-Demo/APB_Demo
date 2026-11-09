(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '@',
          icon: '@'
        },
        template: '<div class="kpi-card"><span class="glyphicon {{icon}}" style="font-size:24px;color:#3498db;"></span><div class="kpi-value">{{value}}</div><div class="kpi-label">{{label}}</div></div>'
      };
    }]);
})();
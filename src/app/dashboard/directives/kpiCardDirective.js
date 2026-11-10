(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '@',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-label"><i class="glyphicon {{icon}}"></i> {{label}}</div><div class="kpi-value">{{value}}</div></div>'
      };
    }]);
})();
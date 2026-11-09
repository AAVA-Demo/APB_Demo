(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          kpi: '='
        },
        template: '<div class="kpi-card"><div class="text-center"><i class="fa kpi-icon" ng-class="kpi.icon"></i></div><div class="kpi-label">{{kpi.label}}</div><div class="kpi-value" ng-if="kpi.format === \'currency\'">${{kpi.value | number:2}}</div><div class="kpi-value" ng-if="kpi.format !== \'currency\'">{{kpi.value}}</div></div>'
      };
    }]);
})();
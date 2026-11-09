(function() {
  'use strict';
  angular.module('kpiDashboardModule')
    .directive('kpiWidget', function() {
      return {
        restrict: 'E',
        scope: {
          kpi: '='
        },
        template: '<div class="kpi-card"><div class="kpi-value">{{kpi.value | currency}}</div><div class="kpi-label">{{kpi.label}}</div><div ng-if="kpi.trend" class="text-center"><i class="fa" ng-class="{\"fa-arrow-up trend-up\": kpi.trend === \"up\", \"fa-arrow-down trend-down\": kpi.trend === \"down\"}"></i></div></div>'
      };
    });
})();
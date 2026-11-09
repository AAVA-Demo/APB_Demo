(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiWidget', function() {
    return {
      restrict: 'E',
      scope: {
        kpi: '='
      },
      template: '<div class="kpi-card"><div class="kpi-label"><i class="fa {{kpi.icon}}"></i> {{kpi.label}}</div><div class="kpi-value">{{kpi.currency}} {{kpi.value | number:2}}</div><div ng-if="kpi.trendValue !== 0" class="kpi-trend"><span ng-class="{\"text-success\": kpi.trend === \"up\", \"text-danger\": kpi.trend === \"down\"}"><i class="fa" ng-class="{\"fa-arrow-up\": kpi.trend === \"up\", \"fa-arrow-down\": kpi.trend === \"down\"}"></i> {{kpi.trendValue | number:2}}</span></div></div>'
    };
  });
})();
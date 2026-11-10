(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          kpiName: '@',
          kpiValue: '=',
          kpiIcon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-icon"><i class="glyphicon {{kpiIcon}}"></i></div><div class="kpi-content"><h4>{{kpiName}}</h4><h2>₹{{kpiValue | number:2}}</h2></div></div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('dashboardModule').directive('dashboardKpi', [function() {
    return {
      restrict: 'E',
      scope: { label: '@', value: '=', icon: '@' },
      template: '<div class="kpi-card"><h3>{{label}}</h3><div class="kpi-value">{{value | currency}}</div></div>'
    };
  }]);
})();
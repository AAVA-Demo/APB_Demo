(function() {
  'use strict';
  angular.module('app.dashboard').directive('kpiCard', [function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '@',
        icon: '@'
      },
      template: '<div class="kpi-card"><div class="label">{{label}}</div><div class="value">{{value}}</div></div>'
    };
  }]);
})();
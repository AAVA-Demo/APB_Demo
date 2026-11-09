(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', [kpiCard]);

  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '<',
        prefix: '@',
        suffix: '@'
      },
      template: '<div class="kpi-card">' +
                '  <div class="kpi-label">{{label}}</div>' +
                '  <div class="kpi-value">{{prefix}}{{value | number:2}}{{suffix}}</div>' +
                '</div>'
    };
  }
})();
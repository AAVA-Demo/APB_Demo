(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiCard', kpiCard);
  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '=',
        icon: '@'
      },
      template: '<div class="kpi-card"><h3><i class="fa {{icon}}"></i> {{title}}</h3><div class="value">₹{{value | number:0}}</div></div>'
    };
  }
})();
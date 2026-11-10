(function() {
  'use strict';
  angular.module('analyticsModule').directive('spendingChart', [spendingChart]);
  function spendingChart() {
    return {
      restrict: 'E',
      scope: { chartType: '=', labels: '=', data: '=', series: '=' },
      template: '<canvas class="chart chart-{{chartType}}" chart-data="data" chart-labels="labels" chart-series="series" chart-options="options"></canvas>',
      link: function(scope) {
        scope.options = { responsive: true, maintainAspectRatio: false, legend: { display: true, position: 'bottom' } };
      }
    };
  }
})();
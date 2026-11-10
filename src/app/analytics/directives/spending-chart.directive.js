(function() {
  'use strict';
  angular.module('analyticsModule').directive('spendingChart', spendingChart);
  spendingChart.$inject = ['ChartService'];
  function spendingChart(ChartService) {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@'
      },
      template: '<canvas id="{{chartId}}" class="chart chart-{{chartType}}" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series" chart-options="chartData.options"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
      }
    };
  }
})();
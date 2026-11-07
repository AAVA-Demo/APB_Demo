(function() {
  'use strict';
  angular.module('app.analytics').directive('spendingChart', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@',
        chartTitle: '@'
      },
      template: '<div class="chart-container"><h4>{{chartTitle}}</h4><canvas id="{{chartId}}" class="chart chart-{{chartType}}" chart-data="chartData.data" chart-labels="chartData.labels" chart-series="chartData.series" chart-options="chartData.options"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
      }
    };
  }]);
})();
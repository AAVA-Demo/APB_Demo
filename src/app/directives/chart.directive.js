(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('chartDirective', [chartDirective]);
  function chartDirective() {
    return {
      restrict: 'E',
      scope: {
        chartType: '=',
        chartData: '=',
        chartTitle: '='
      },
      template: '<div class="chart-container">' +
                '  <h3>{{chartTitle}}</h3>' +
                '  <canvas id="{{chartId}}"></canvas>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            renderChart(newData);
          }
        });
        function renderChart(data) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }
          var chartConfig = buildChartConfig(scope.chartType, data);
          chart = new Chart(ctx, chartConfig);
        }
        function buildChartConfig(type, data) {
          var config = {
            type: type,
            data: {},
            options: {
              responsive: true,
              maintainAspectRatio: true
            }
          };
          if (type === 'pie') {
            config.data = {
              labels: data.map(function(d) { return d.category; }),
              datasets: [{
                data: data.map(function(d) { return d.amount; }),
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                ]
              }]
            };
          } else if (type === 'line') {
            config.data = {
              labels: data.map(function(d) { return d.month; }),
              datasets: [{
                label: 'Monthly Spend',
                data: data.map(function(d) { return d.totalSpend; }),
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true
              }]
            };
          } else if (type === 'bar') {
            config.data = {
              labels: data.map(function(d) { return d.cardName; }),
              datasets: [{
                label: 'Card-wise Spend',
                data: data.map(function(d) { return d.totalSpend; }),
                backgroundColor: '#4BC0C0'
              }]
            };
          }
          return config;
        }
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }
})();
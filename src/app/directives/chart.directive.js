(function() {
  'use strict';
  angular.module('creditCardApp').directive('chartDirective', [function() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@',
        onClick: '&'
      },
      template: '<canvas id="{{chartId}}" width="400" height="300"></canvas>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart_' + Math.random().toString(36).substr(2, 9);
        var chart = null;

        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            renderChart(newData);
          }
        }, true);

        function renderChart(data) {
          var canvas = element.find('canvas')[0];
          var ctx = canvas.getContext('2d');
          if (chart) {
            chart.destroy();
          }

          if (scope.chartType === 'pie') {
            var labels = data.map(function(d) { return d.category; });
            var values = data.map(function(d) { return d.totalSpend; });
            var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
            chart = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: colors
                }]
              },
              options: {
                responsive: true,
                onClick: function(evt, item) {
                  if (item.length > 0) {
                    var index = item[0]._index;
                    var category = labels[index];
                    scope.onClick({category: category});
                    scope.$apply();
                  }
                }
              }
            });
          } else if (scope.chartType === 'line') {
            var labels = data.map(function(d) { return d.month; });
            var values = data.map(function(d) { return d.totalSpend; });
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Monthly Spend',
                  data: values,
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  fill: true
                }]
              },
              options: {
                responsive: true,
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }
        }

        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
})();
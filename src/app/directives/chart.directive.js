(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('chartDirective', chartDirective);
  chartDirective.$inject = [];
  function chartDirective() {
    return {
      restrict: 'A',
      scope: {
        chartType: '@',
        chartData: '=',
        onClick: '='
      },
      link: function(scope, element, attrs) {
        var chart = null;
        scope.$on('renderTrendChart', function(event, data) {
          if (scope.chartType === 'line' && data) {
            renderLineChart(data);
          }
        });
        scope.$on('renderCategoryChart', function(event, data) {
          if (scope.chartType === 'pie' && data) {
            renderPieChart(data);
          }
        });
        function renderLineChart(data) {
          var ctx = element[0].getContext('2d');
          if (chart) chart.destroy();
          var labels = data.map(function(d) { return d.month; });
          var values = data.map(function(d) { return d.totalSpend; });
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Monthly Spend (₹)',
                data: values,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
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
        function renderPieChart(data) {
          var ctx = element[0].getContext('2d');
          if (chart) chart.destroy();
          var labels = data.map(function(d) { return d.category; });
          var values = data.map(function(d) { return d.amount; });
          var colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
          ];
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
              maintainAspectRatio: true,
              onClick: function(evt, item) {
                if (item.length > 0 && scope.onClick) {
                  var index = item[0]._index;
                  var category = labels[index];
                  scope.$apply(function() {
                    scope.onClick(category);
                  });
                }
              }
            }
          });
        }
        scope.$on('$destroy', function() {
          if (chart) chart.destroy();
        });
      }
    };
  }
})();
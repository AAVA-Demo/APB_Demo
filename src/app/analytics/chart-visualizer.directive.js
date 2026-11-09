(function() {
  'use strict';
  angular.module('app.analytics').directive('chartVisualizer', ['$timeout', chartVisualizer]);
  function chartVisualizer($timeout) {
    return {
      restrict: 'E',
      scope: {
        chartType: '@',
        onDrillDown: '&'
      },
      template: '<canvas id="analyticsChart" width="400" height="200"></canvas>',
      link: function(scope, element, attrs) {
        var chart = null;
        var canvas = element.find('canvas')[0];
        var ctx = canvas.getContext('2d');
        scope.$on('analyticsDataLoaded', function(event, data) {
          $timeout(function() {
            renderChart(data);
          }, 100);
        });
        function renderChart(data) {
          if (chart) {
            chart.destroy();
          }
          if (scope.chartType === 'category') {
            renderCategoryChart(data.categoryBreakdown);
          } else if (scope.chartType === 'monthly') {
            renderMonthlyChart(data.monthlyTrends);
          }
        }
        function renderCategoryChart(categoryData) {
          var labels = categoryData.map(function(c) { return c.category; });
          var values = categoryData.map(function(c) { return c.totalSpend; });
          chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: values,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              onClick: function(event, items) {
                if (items.length > 0) {
                  var index = items[0]._index;
                  var category = labels[index];
                  scope.$apply(function() {
                    scope.onDrillDown({ category: category });
                  });
                }
              },
              legend: {
                position: 'right'
              },
              title: {
                display: true,
                text: 'Spending by Category'
              }
            }
          });
        }
        function renderMonthlyChart(monthlyData) {
          var labels = monthlyData.map(function(m) { return m.month; });
          var values = monthlyData.map(function(m) { return m.totalSpend; });
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
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                      return '$' + value.toFixed(0);
                    }
                  }
                }]
              },
              title: {
                display: true,
                text: 'Monthly Spending Trends'
              }
            }
          });
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
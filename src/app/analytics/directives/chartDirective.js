(function() {
  'use strict';
  angular.module('analyticsModule').directive('spendingChart', ['$timeout', 'CategoryService', function($timeout, CategoryService) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        onSegmentClick: '&'
      },
      template: '<div class="chart-container">' +
                '  <h4>Category-Wise Spending</h4>' +
                '  <canvas id="categoryChart" width="400" height="400"></canvas>' +
                '</div>',
      link: function(scope, element) {
        var chart = null;
        function renderChart() {
          if (!scope.data || scope.data.length === 0) {
            return;
          }
          var ctx = element.find('canvas')[0].getContext('2d');
          var labels = scope.data.map(function(item) { return item.categoryName; });
          var amounts = scope.data.map(function(item) { return item.totalAmount; });
          var colors = scope.data.map(function(item) {
            var category = CategoryService.getCategoryById(item.categoryId);
            return category ? category.colorCode : '#999';
          });
          if (chart) {
            chart.destroy();
          }
          chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: amounts,
                backgroundColor: colors
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              onClick: function(event, elements) {
                if (elements.length > 0) {
                  var index = elements[0]._index;
                  var categoryId = scope.data[index].categoryId;
                  scope.$apply(function() {
                    scope.onSegmentClick({ categoryId: categoryId });
                  });
                }
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label = data.labels[tooltipItem.index];
                    var value = data.datasets[0].data[tooltipItem.index];
                    var total = data.datasets[0].data.reduce(function(a, b) { return a + b; }, 0);
                    var percent = ((value / total) * 100).toFixed(1);
                    return label + ': $' + value.toLocaleString() + ' (' + percent + '%)';
                  }
                }
              }
            }
          });
        }
        scope.$watch('data', function(newVal) {
          if (newVal) {
            $timeout(function() {
              renderChart();
            }, 100);
          }
        });
        scope.$on('$destroy', function() {
          if (chart) {
            chart.destroy();
          }
        });
      }
    };
  }]);
})();
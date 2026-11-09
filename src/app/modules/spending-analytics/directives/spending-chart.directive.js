(function() {
  'use strict';
  angular.module('spendingAnalytics').directive('spendingChart', ['VisualizationFactory', '$timeout', 'CategoryService', function(VisualizationFactory, $timeout, CategoryService) {
    return {
      restrict: 'E',
      scope: {
        chartType: '@',
        chartData: '='
      },
      template: '<div class="chart-container"><canvas id="{{chartId}}" width="400" height="300"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.chartId = 'chart-' + Math.random().toString(36).substring(7);
        let chartInstance = null;
        scope.$watch('chartData', function(newData) {
          if (!newData) return;
          $timeout(function() {
            if (chartInstance) {
              chartInstance.destroy();
            }
            if (scope.chartType === 'category') {
              const labels = newData.map(d => d.categoryName);
              const data = newData.map(d => d.totalAmount);
              const categories = CategoryService.getCategories();
              const colors = newData.map(d => {
                const cat = categories.find(c => c.id === d.categoryId);
                return cat ? cat.color : '#95a5a6';
              });
              chartInstance = VisualizationFactory.createBarChart(scope.chartId, labels, data, colors);
            } else if (scope.chartType === 'trend') {
              const labels = newData.map(d => d.month);
              const data = newData.map(d => d.totalAmount);
              chartInstance = VisualizationFactory.createLineChart(scope.chartId, labels, data);
            }
          }, 100);
        });
        scope.$on('$destroy', function() {
          if (chartInstance) {
            chartInstance.destroy();
          }
        });
      }
    };
  }]);
})();
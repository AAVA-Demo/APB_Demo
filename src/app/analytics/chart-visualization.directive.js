(function() {
  'use strict';
  angular.module('analyticsModule').directive('chartVisualization', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: { chartData: '=', chartType: '@', chartTitle: '@' },
      template: '<div class="chart-container"><h4>{{chartTitle}}</h4><canvas id="{{canvasId}}" width="400" height="200"></canvas></div>',
      link: function(scope, element, attrs) {
        scope.canvasId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('chartData', function(newData) {
          if (newData && newData.length > 0) {
            $timeout(function() {
              var ctx = document.getElementById(scope.canvasId);
              if (!ctx) return;
              if (chart) chart.destroy();
              var labels = newData.map(function(d) { return d.category || d.cardId || d.month; });
              var values = newData.map(function(d) { return d.totalAmount || d.totalSpend; });
              var config = {
                type: scope.chartType || 'bar',
                data: {
                  labels: labels,
                  datasets: [{
                    label: scope.chartTitle,
                    data: values,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                  }]
                },
                options: { responsive: true, maintainAspectRatio: true }
              };
              chart = new Chart(ctx, config);
            }, 0);
          }
        }, true);
      }
    };
  }]);
})();
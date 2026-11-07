(function() {
  'use strict';
  angular.module('ccAnalyticsModule').directive('spendingChart', ['CategoryService', function(CategoryService) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<div class="chart-container"><canvas id="{{chartId}}"></canvas></div>',
      link: function(scope, element) {
        scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            setTimeout(function() {
              var ctx = document.getElementById(scope.chartId);
              if (ctx) {
                if (chart) chart.destroy();
                var labels = newData.map(function(item) { return item.category || item.cardName; });
                var values = newData.map(function(item) { return item.amount || item.totalSpend; });
                var colors = CategoryService.getCategories().map(function(cat) { return cat.color; });
                chart = new Chart(ctx, {
                  type: scope.type || 'pie',
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
                      if (item.length > 0) {
                        var index = item[0]._index;
                        scope.$emit('category:selected', labels[index]);
                      }
                    }
                  }
                });
              }
            }, 100);
          }
        });
        scope.$on('$destroy', function() {
          if (chart) chart.destroy();
        });
      }
    };
  }]);
})();
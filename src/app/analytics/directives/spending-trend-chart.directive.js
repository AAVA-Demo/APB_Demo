(function() {
  'use strict';
  angular.module('app.analytics').directive('spendingTrendChart', ['ChartConfigFactory', '$timeout', function(ChartConfigFactory, $timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      template: '<canvas id="trendChart" width="400" height="200"></canvas>',
      link: function(scope, element) {
        var chart = null;
        scope.$watch('data', function(newData) {
          if (!newData || !newData.monthlyTrends) return;
          $timeout(function() {
            var ctx = element.find('canvas')[0].getContext('2d');
            var labels = newData.monthlyTrends.map(function(item) { return item.month; });
            var values = newData.monthlyTrends.map(function(item) { return item.totalSpend; });
            var config = ChartConfigFactory.getTrendChartConfig(labels, values);
            if (chart) chart.destroy();
            chart = new Chart(ctx, config);
          }, 100);
        });
        scope.$on('$destroy', function() {
          if (chart) chart.destroy();
        });
      }
    };
  }]);
})();
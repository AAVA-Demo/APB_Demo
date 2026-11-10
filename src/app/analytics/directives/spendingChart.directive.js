(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .directive('spendingChart', function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          type: '@',
          onSegmentClick: '&'
        },
        template: '<canvas id="{{chartId}}" width="400" height="200"></canvas>',
        link: function(scope, element, attrs) {
          scope.chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
          scope.$watch('data', function(newData) {
            if (newData) {
              var ctx = document.getElementById(scope.chartId).getContext('2d');
              var chartData, chartOptions;
              if (scope.type === 'category') {
                chartData = {
                  labels: newData.map(function(c) { return c.categoryName; }),
                  datasets: [{
                    data: newData.map(function(c) { return c.totalSpend; }),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                  }]
                };
                chartOptions = {
                  responsive: true,
                  onClick: function(evt, item) {
                    if (item.length > 0) {
                      var idx = item[0]._index;
                      scope.onSegmentClick({category: newData[idx]});
                      scope.$apply();
                    }
                  }
                };
                new Chart(ctx, {type: 'pie', data: chartData, options: chartOptions});
              } else if (scope.type === 'monthly') {
                chartData = {
                  labels: newData.map(function(m) { return m.month; }),
                  datasets: [{
                    label: 'Monthly Spend',
                    data: newData.map(function(m) { return m.totalSpend; }),
                    backgroundColor: '#36A2EB'
                  }]
                };
                chartOptions = {responsive: true};
                new Chart(ctx, {type: 'bar', data: chartData, options: chartOptions});
              }
            }
          });
        }
      };
    });
})();
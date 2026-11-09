(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('spendingChart', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        scope: {
          data: '=',
          onDrillDown: '='
        },
        template: '<canvas id="spendingChart" width="400" height="300"></canvas>',
        link: function(scope, element, attrs) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                var ctx = element.find('canvas')[0].getContext('2d');
                if (chart) {
                  chart.destroy();
                }
                var labels = newData.map(function(item) { return item.category; });
                var amounts = newData.map(function(item) { return item.totalAmount; });
                var colors = [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'
                ];
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
                    onClick: function(evt, item) {
                      if (item.length > 0 && scope.onDrillDown) {
                        var index = item[0]._index;
                        var category = labels[index];
                        scope.$apply(function() {
                          scope.onDrillDown(category);
                        });
                      }
                    }
                  }
                });
              }, 0);
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
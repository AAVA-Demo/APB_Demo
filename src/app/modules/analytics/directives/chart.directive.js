(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('chartDirective', ['$timeout', 'CategoryService', function($timeout, CategoryService) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          onSelect: '&'
        },
        template: '<canvas id="categoryChart" width="400" height="300"></canvas>',
        link: function(scope, element) {
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              $timeout(function() {
                var ctx = element.find('canvas')[0].getContext('2d');
                var labels = newData.map(function(item) { return item.category; });
                var values = newData.map(function(item) { return item.amount; });
                var colors = newData.map(function(item) { return CategoryService.getCategoryColor(item.category); });
                if (chart) {
                  chart.destroy();
                }
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
                      if (item.length > 0) {
                        var index = item[0]._index;
                        var category = labels[index];
                        scope.$apply(function() {
                          scope.onSelect({ category: category });
                        });
                      }
                    }
                  }
                });
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
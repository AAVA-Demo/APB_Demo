(function() {
  'use strict';
  angular.module('analyticsModule')
    .directive('chartDirective', function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          onCategoryClick: '&'
        },
        template: '<div class="chart-container"><canvas id="categoryChart" width="400" height="200"></canvas></div>',
        link: function(scope, element, attrs) {
          var ctx = element.find('canvas')[0].getContext('2d');
          var chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              var labels = [];
              var values = [];
              var colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
              angular.forEach(newData, function(cat) {
                labels.push(cat.category);
                values.push(cat.totalSpend);
              });
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
                  onClick: function(evt, item) {
                    if (item.length > 0) {
                      var index = item[0]._index;
                      var category = labels[index];
                      scope.$apply(function() {
                        scope.onCategoryClick({category: category});
                      });
                    }
                  }
                }
              });
            }
          });
        }
      };
    });
})();
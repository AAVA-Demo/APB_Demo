(function() {
  'use strict';
  angular.module('creditCard.analytics').directive('categoryChart', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        onClick: '&'
      },
      template: '<div><canvas id="categoryChartCanvas" width="400" height="200"></canvas></div>',
      link: function(scope, element) {
        var chart = null;
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            var ctx = document.getElementById('categoryChartCanvas').getContext('2d');
            var labels = newData.map(function(d) { return d.category; });
            var values = newData.map(function(d) { return d.totalAmount; });
            var colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
            if (chart) chart.destroy();
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
                    scope.onClick({category: newData[index]});
                    scope.$apply();
                  }
                }
              }
            });
          }
        });
      }
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('categoryChart', function() {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        template: '<div><canvas id="categoryChartCanvas" width="400" height="300"></canvas></div>',
        link: function(scope, element, attrs) {
          var chartInstance = null;
          scope.$watch('data', function(newVal) {
            if (newVal && newVal.length > 0) {
              var ctx = element.find('canvas')[0].getContext('2d');
              var labels = newVal.map(function(c) { return c.category; });
              var data = newVal.map(function(c) { return c.totalAmount; });
              var colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0'];
              if (chartInstance) {
                chartInstance.destroy();
              }
              chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: data,
                    backgroundColor: colors
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    position: 'bottom'
                  }
                }
              });
            }
          });
        }
      };
    });
})();
(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          onDrillDown: '&'
        },
        template: '<div><canvas id="spendingChart"></canvas></div>',
        link: function(scope, element, attrs) {
          let chart = null;
          scope.$watch('data', function(newData) {
            if (newData && newData.length > 0) {
              const canvas = element.find('canvas')[0];
              const ctx = canvas.getContext('2d');
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: newData.map(function(d) { return d.category; }),
                  datasets: [{
                    data: newData.map(function(d) { return d.totalAmount; }),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                  }]
                },
                options: {
                  responsive: true,
                  onClick: function(evt, item) {
                    if (item.length > 0) {
                      const index = item[0]._index;
                      scope.onDrillDown({ category: newData[index].category });
                      scope.$apply();
                    }
                  }
                }
              });
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
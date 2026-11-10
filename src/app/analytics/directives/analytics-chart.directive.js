(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('analyticsChart', ['CategoryMappingService', function(CategoryMappingService) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          type: '@',
          onDrillDown: '&'
        },
        template: '<canvas id="analyticsChart" width="400" height="200"></canvas>',
        link: function(scope, element) {
          let chart = null;
          scope.$watch('data', function(newData) {
            if (!newData) return;
            const canvas = element.find('canvas')[0];
            const ctx = canvas.getContext('2d');
            if (chart) chart.destroy();
            const labels = newData.map(d => d.category || d.month);
            const values = newData.map(d => d.totalSpend);
            const colors = newData.map(d => CategoryMappingService.getCategoryColor(d.category || 'Miscellaneous'));
            chart = new Chart(ctx, {
              type: scope.type || 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Spending',
                  data: values,
                  backgroundColor: colors,
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                onClick: function(evt, items) {
                  if (items.length > 0) {
                    const index = items[0]._index;
                    const category = labels[index];
                    scope.onDrillDown({ category: category });
                    scope.$apply();
                  }
                }
              }
            });
          });
          scope.$on('$destroy', function() {
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();
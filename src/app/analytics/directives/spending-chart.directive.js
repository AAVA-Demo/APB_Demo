(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('spendingChart', [function() {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          onDrillDown: '&'
        },
        template: '<div class="chart-container">' +
                  '<h4>Category-Wise Spending</h4>' +
                  '<canvas id="categoryChart" width="400" height="300"></canvas>' +
                  '<h4 style="margin-top: 30px;">Monthly Trends</h4>' +
                  '<canvas id="monthlyChart" width="400" height="300"></canvas>' +
                  '</div>',
        link: function(scope, element, attrs) {
          var categoryChart = null;
          var monthlyChart = null;
          scope.$watch('data', function(newVal) {
            if (newVal && newVal.categoryBreakdown) {
              setTimeout(function() {
                var ctxCategory = document.getElementById('categoryChart');
                if (ctxCategory) {
                  if (categoryChart) categoryChart.destroy();
                  categoryChart = new Chart(ctxCategory, {
                    type: 'doughnut',
                    data: {
                      labels: newVal.categoryBreakdown.map(function(c) { return c.category; }),
                      datasets: [{
                        data: newVal.categoryBreakdown.map(function(c) { return c.totalSpend; }),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
                      }]
                    },
                    options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      onClick: function(evt, item) {
                        if (item.length > 0) {
                          var index = item[0]._index;
                          var category = newVal.categoryBreakdown[index].category;
                          scope.onDrillDown({ category: category });
                        }
                      }
                    }
                  });
                }
                var ctxMonthly = document.getElementById('monthlyChart');
                if (ctxMonthly && newVal.monthlyTrends) {
                  if (monthlyChart) monthlyChart.destroy();
                  monthlyChart = new Chart(ctxMonthly, {
                    type: 'bar',
                    data: {
                      labels: newVal.monthlyTrends.map(function(m) { return m.month; }),
                      datasets: [{
                        label: 'Total Spend',
                        data: newVal.monthlyTrends.map(function(m) { return m.totalSpend; }),
                        backgroundColor: '#36A2EB'
                      }]
                    },
                    options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        yAxes: [{
                          ticks: { beginAtZero: true }
                        }]
                      }
                    }
                  });
                }
              }, 100);
            }
          });
          scope.$on('$destroy', function() {
            if (categoryChart) categoryChart.destroy();
            if (monthlyChart) monthlyChart.destroy();
          });
        }
      };
    }]);
})();
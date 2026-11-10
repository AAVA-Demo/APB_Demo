(function() {
  'use strict';
  angular.module('app.cardManagement')
    .directive('cardDetails', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          analysis: '='
        },
        template: '<div class="chart-container" ng-if="card">' +
                  '<h4>{{card.cardNumber}} - {{card.cardType}}</h4>' +
                  '<div class="row">' +
                  '<div class="col-sm-6"><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</div>' +
                  '<div class="col-sm-6"><strong>Available Credit:</strong> ${{card.availableCredit | number:2}}</div>' +
                  '</div>' +
                  '<div class="row" style="margin-top: 10px;">' +
                  '<div class="col-sm-6"><strong>Outstanding:</strong> ${{card.outstandingAmount | number:2}}</div>' +
                  '<div class="col-sm-6"><strong>Expiry:</strong> {{card.expiryDate}}</div>' +
                  '</div>' +
                  '<div ng-if="analysis" style="margin-top: 20px;">' +
                  '<h5>Monthly Spend: ${{analysis.monthlySpend | number:2}}</h5>' +
                  '<canvas id="trendChart" width="400" height="200"></canvas>' +
                  '<h5 style="margin-top: 20px;">Top Categories</h5>' +
                  '<ul class="list-group">' +
                  '<li class="list-group-item" ng-repeat="cat in analysis.topCategories">{{cat.category}}: ${{cat.amount | number:2}}</li>' +
                  '</ul>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          var chart = null;
          scope.$watch('analysis', function(newVal) {
            if (newVal && newVal.monthlyTrends) {
              setTimeout(function() {
                var ctx = document.getElementById('trendChart');
                if (ctx) {
                  if (chart) chart.destroy();
                  chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: newVal.monthlyTrends.map(function(t) { return t.month; }),
                      datasets: [{
                        label: 'Monthly Spend',
                        data: newVal.monthlyTrends.map(function(t) { return t.spend; }),
                        borderColor: '#337ab7',
                        backgroundColor: 'rgba(51, 122, 183, 0.1)',
                        tension: 0.3
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
            if (chart) chart.destroy();
          });
        }
      };
    }]);
})();
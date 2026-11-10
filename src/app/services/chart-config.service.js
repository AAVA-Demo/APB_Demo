(function() {
  'use strict';
  angular.module('app.analytics')
    .service('ChartConfigService', [function() {
      this.generateDonutConfig = function(categoryData, onClickCallback) {
        return {
          type: 'doughnut',
          data: {
            labels: categoryData.map(function(c) { return c.category; }),
            datasets: [{
              data: categoryData.map(function(c) { return c.amount; }),
              backgroundColor: categoryData.map(function(c) { return c.color; })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            onClick: function(evt, item) {
              if (item.length > 0 && onClickCallback) {
                var index = item[0]._index;
                var category = categoryData[index].category;
                onClickCallback(category);
              }
            },
            legend: {
              position: 'bottom'
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var label = data.labels[tooltipItem.index] || '';
                  var value = data.datasets[0].data[tooltipItem.index];
                  return label + ': $' + value.toLocaleString();
                }
              }
            }
          }
        };
      };
      this.generateLineConfig = function(trendData) {
        return {
          type: 'line',
          data: {
            labels: trendData.map(function(t) { return t.month; }),
            datasets: [{
              label: 'Total Spend',
              data: trendData.map(function(t) { return t.totalSpend; }),
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem) {
                  return 'Spend: $' + tooltipItem.yLabel.toLocaleString();
                }
              }
            }
          }
        };
      };
      this.generateBarConfig = function(cardData) {
        return {
          type: 'horizontalBar',
          data: {
            labels: cardData.map(function(c) { return c.cardNumber; }),
            datasets: [{
              label: 'Total Spend',
              data: cardData.map(function(c) { return c.totalSpend; }),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              xAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem) {
                  return 'Spend: $' + tooltipItem.xLabel.toLocaleString();
                }
              }
            }
          }
        };
      };
    }]);
})();
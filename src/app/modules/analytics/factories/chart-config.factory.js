(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('ChartConfigFactory', [ChartConfigFactory]);
  function ChartConfigFactory() {
    return {
      getPieChartConfig: getPieChartConfig,
      getLineChartConfig: getLineChartConfig
    };
    function getPieChartConfig() {
      return {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: true,
          position: 'bottom'
        }
      };
    }
    function getLineChartConfig() {
      return {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    }
  }
})();
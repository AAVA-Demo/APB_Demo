(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .directive('analyticsChart', [analyticsChart]);

  function analyticsChart() {
    return {
      restrict: 'E',
      scope: {
        chartData: '=',
        chartType: '@',
        chartOptions: '='
      },
      templateUrl: 'src/app/analytics/views/chart.template.html'
    };
  }
})();
(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DataVisualizationService', [function() {
      this.renderChart = function(canvasId, type, data, options) {
        var ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return new Chart(ctx, {
          type: type,
          data: data,
          options: angular.extend({ responsive: true, maintainAspectRatio: true }, options || {})
        });
      };
      this.destroyChart = function(chart) {
        if (chart) chart.destroy();
      };
    }]);
})();
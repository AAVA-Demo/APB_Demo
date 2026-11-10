(function() {
  'use strict';
  angular.module('analytics')
    .directive('chartRenderer', [function() {
      return {
        restrict: 'E',
        scope: {
          config: '='
        },
        template: '<canvas></canvas>',
        link: function(scope, element) {
          let chart = null;
          const canvas = element.find('canvas')[0];
          const ctx = canvas.getContext('2d');
          scope.$watch('config', function(newConfig) {
            if (newConfig) {
              if (chart) {
                chart.destroy();
              }
              chart = new Chart(ctx, newConfig);
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
(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('cardUtilization', [function() {
      return {
        restrict: 'E',
        scope: {
          percentage: '='
        },
        template: '<div class="utilization-bar"><div class="utilization-fill" ng-style="{width: percentage + \'%\'}"></div></div><p class="text-muted" style="margin-top: 5px; font-size: 12px;">Utilization: {{percentage}}%</p>'
      };
    }]);
})();
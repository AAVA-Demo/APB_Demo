(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('creditUtilization', [function() {
      return {
        restrict: 'E',
        scope: {
          utilization: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-label">Credit Utilization</div><div class="progress" style="height: 30px; margin-top: 10px;"><div class="progress-bar" ng-class="{\"progress-bar-success\": utilization < 30, \"progress-bar-warning\": utilization >= 30 && utilization < 70, \"progress-bar-danger\": utilization >= 70}" role="progressbar" style="width: {{utilization}}%; font-size: 16px; line-height: 30px;">{{utilization}}%</div></div></div>'
      };
    }]);
})();
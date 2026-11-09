(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          trend: '=',
          icon: '@'
        },
        template: `
          <div class="kpi-widget panel panel-default">
            <div class="panel-body">
              <div class="kpi-icon">
                <i class="glyphicon" ng-class="icon"></i>
              </div>
              <div class="kpi-content">
                <h4 class="kpi-label">{{label}}</h4>
                <h2 class="kpi-value">{{value | currency}}</h2>
                <span class="kpi-trend" ng-if="trend">
                  <i class="glyphicon" ng-class="trend > 0 ? 'glyphicon-arrow-up text-success' : 'glyphicon-arrow-down text-danger'"></i>
                  {{trend}}%
                </span>
              </div>
            </div>
          </div>
        `
      };
    }]);
})();
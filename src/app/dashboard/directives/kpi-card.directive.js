(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          unit: '@',
          trend: '@',
          trendValue: '='
        },
        template: '<div class="kpi-card">' +
                  '<div class="kpi-label">{{label}}</div>' +
                  '<div class="kpi-value">{{unit}}{{value | number:2}}</div>' +
                  '<div ng-if="trend" class="kpi-trend" ng-class="{\"trend-up\": trend === \"up\", \"trend-down\": trend === \"down\"}">' +
                  '<span ng-if="trend === \"up\"">▲</span>' +
                  '<span ng-if="trend === \"down\"">▼</span>' +
                  '{{trendValue}}%' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
        }
      };
    }]);
})();
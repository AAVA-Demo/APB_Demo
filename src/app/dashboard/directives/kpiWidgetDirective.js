(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        widget: '='
      },
      template: '<div class="kpi-widget">' +
                '  <h4>{{widget.label}}</h4>' +
                '  <div class="value">{{widget.value | currency:"$":0}}</div>' +
                '  <div class="trend" ng-if="widget.trendPercent" ng-class="widget.trendDirection">' +
                '    <span ng-if="widget.trendDirection === \'up\'">▲</span>' +
                '    <span ng-if="widget.trendDirection === \'down\'">▼</span>' +
                '    {{widget.trendPercent}}% vs last month' +
                '  </div>' +
                '</div>'
    };
  }]);
})();
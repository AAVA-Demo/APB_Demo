(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiCard', kpiCard);
  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '@',
        icon: '@',
        trend: '@',
        cssClass: '@'
      },
      template: '<div class="kpi-card"><div><i class="fa {{icon}} fa-2x" style="color: #007bff;"></i></div><div class="kpi-value" ng-class="cssClass">{{value}}</div><div class="kpi-label">{{label}}</div><div ng-if="trend" class="" ng-class="{positive: trend > 0, negative: trend < 0}"><i class="fa" ng-class="{\"fa-arrow-up\": trend > 0, \"fa-arrow-down\": trend < 0}"></i> {{trend}}%</div></div>'
    };
  }
})();
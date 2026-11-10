(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '@',
          icon: '@',
          currency: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-icon"><span class="glyphicon" ng-class="icon"></span></div><div class="kpi-value">{{currency}}{{value | number:2}}</div><div class="kpi-label">{{label}}</div></div>'
      };
    });
})();
(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-icon"><i class="{{icon}}"></i></div><div class="kpi-content"><h4>{{title}}</h4><p class="kpi-value">{{value | currency}}</p></div></div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-icon"><i class="glyphicon glyphicon-{{icon}}"></i></div><div class="kpi-content"><h4>{{title}}</h4><p class="kpi-value">{{value | currency}}</p></div></div>'
      };
    }]);
})();
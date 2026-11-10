(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '@',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-icon"><i class="glyphicon {{icon}}"></i></div><div class="kpi-content"><h4>{{title}}</h4><h2>{{value}}</h2></div></div>'
      };
    });
})();
(function() {
  'use strict';
  angular.module('app.dashboard').directive('kpiCard', function() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '@',
        icon: '@'
      },
      template: '<div class="kpi-card panel panel-default"><div class="panel-body"><h4>{{title}}</h4><p class="kpi-value">{{value}}</p></div></div>'
    };
  });
})();
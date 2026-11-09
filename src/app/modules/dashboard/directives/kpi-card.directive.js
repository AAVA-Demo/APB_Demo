(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@',
          color: '@'
        },
        template: '<div class="kpi-card panel" ng-class="color"><div class="panel-body"><div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div><div class="kpi-content"><h4>{{title}}</h4><h2>{{value | currency}}</h2></div></div></div>'
      };
    }]);
})();
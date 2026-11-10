(function() {
  'use strict';
  angular.module('dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@',
          trend: '@'
        },
        template: '<div class="kpi-widget">' +
                  '<i class="fa {{icon}} icon"></i>' +
                  '<h3>{{title}}</h3>' +
                  '<div class="value">{{value | currency:"$":0}}</div>' +
                  '<small ng-if="trend">{{trend}}</small>' +
                  '</div>'
      };
    }]);
})();
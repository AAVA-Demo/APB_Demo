(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          format: '@',
          cssClass: '@'
        },
        template: '<div class="kpi-widget">' +
                  '<h3>{{label}}</h3>' +
                  '<div class="value" ng-class="cssClass">' +
                  '<span ng-if="format === \"currency\"">${{value | number:2}}</span>' +
                  '<span ng-if="format === \"percent\"">{{value | number:2}}%</span>' +
                  '<span ng-if="format === \"number\"">{{value | number:0}}</span>' +
                  '</div>' +
                  '</div>'
      };
    }]);
})();
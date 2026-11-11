(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '@',
          icon: '@',
          cssClass: '@'
        },
        template: '<div class="kpi-widget" ng-class="cssClass">' +
                  '<h4>{{title}}</h4>' +
                  '<div class="value">{{value}}</div>' +
                  '</div>'
      };
    }]);
})();
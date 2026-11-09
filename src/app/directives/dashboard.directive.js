(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          title: '=',
          value: '=',
          format: '='
        },
        template: '<div class="panel panel-info kpi-card">' +
                  '<div class="panel-heading"><h4>{{ title }}</h4></div>' +
                  '<div class="panel-body">' +
                  '<h2 ng-if="format === \'currency\'">{{ value | currency }}</h2>' +
                  '<h2 ng-if="format !== \'currency\'">{{ value }}</h2>' +
                  '</div>' +
                  '</div>'
      };
    }]);
})();
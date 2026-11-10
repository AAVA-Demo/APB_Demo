(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@',
          color: '@'
        },
        template: '<div class="panel panel-default kpi-card" style="border-left: 4px solid {{color}}">' +
                  '<div class="panel-body">' +
                  '<div class="row">' +
                  '<div class="col-xs-9">' +
                  '<h4>{{title}}</h4>' +
                  '<h2>${{value | number:2}}</h2>' +
                  '</div>' +
                  '<div class="col-xs-3 text-right">' +
                  '<i class="glyphicon {{icon}}" style="font-size: 48px; color: {{color}}"></i>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>'
      };
    });
})();
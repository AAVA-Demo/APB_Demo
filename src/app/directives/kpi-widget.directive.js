(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          format: '@'
        },
        template: '<div class="panel panel-info kpi-widget">' +
                  '<div class="panel-body">' +
                  '<h4>{{label}}</h4>' +
                  '<h2 ng-if="format === \'currency\'">{{value | currency}}</h2>' +
                  '<h2 ng-if="format !== \'currency\'">{{value | number:2}}</h2>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('value', function(newVal) {
            if (newVal !== undefined && newVal !== null) {
              element.find('.panel').addClass('loaded');
            }
          });
        }
      };
    }]);
})();
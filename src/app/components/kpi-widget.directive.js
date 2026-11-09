(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiWidget', function() {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '=',
          icon: '@',
          currency: '@'
        },
        template: '<div class="kpi-widget panel panel-default">' +
                  '  <div class="panel-body">' +
                  '    <div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div>' +
                  '    <div class="kpi-content">' +
                  '      <h4>{{ title }}</h4>' +
                  '      <h2><span ng-if="currency">{{ currency }}</span>{{ value | number:2 }}</h2>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();
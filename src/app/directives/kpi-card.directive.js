(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', kpiCard);
  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        value: '=',
        format: '='
      },
      template: '<div class="panel panel-info kpi-card">' +
                '  <div class="panel-heading">' +
                '    <h4 class="panel-title">{{title}}</h4>' +
                '  </div>' +
                '  <div class="panel-body">' +
                '    <h2 class="kpi-value" ng-if="format === \'currency\'">' +
                '      {{value | currency}}' +
                '    </h2>' +
                '    <h2 class="kpi-value" ng-if="format !== \'currency\'">' +
                '      {{value | number:2}}' +
                '    </h2>' +
                '  </div>' +
                '</div>'
    };
  }
})();
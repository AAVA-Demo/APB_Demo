(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', [kpiCard]);
  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '=',
        icon: '@',
        color: '@'
      },
      template: '<div class="kpi-card" ng-class="color">' +
                '  <div class="kpi-icon" aria-hidden="true"><i class="fa" ng-class="icon"></i></div>' +
                '  <div class="kpi-content">' +
                '    <h4 class="kpi-title" aria-label="{{title}}">{{title}}</h4>' +
                '    <p class="kpi-value" aria-label="{{title}} value: {{value | currency}}">{{value | currency}}</p>' +
                '  </div>' +
                '</div>'
    };
  }
})();
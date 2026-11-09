(function() {
  'use strict';
  angular.module('creditCardApp.kpi').directive('kpiCard', [function() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '=',
        icon: '@'
      },
      template: '<div class="kpi-card"><div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div><div class="kpi-content"><h4>{{ title }}</h4><p class="kpi-value">${{ value | number:2 }}</p></div></div>'
    };
  }]);
})();
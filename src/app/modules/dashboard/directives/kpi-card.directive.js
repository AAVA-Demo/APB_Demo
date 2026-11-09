(function() {
  'use strict';
  angular.module('dashboardKpi').directive('kpiCard', ['$filter', function($filter) {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        format: '@'
      },
      template: '<div class="kpi-card"><div class="kpi-label">{{label}}</div><div class="kpi-value">{{formattedValue}}</div></div>',
      link: function(scope, element, attrs) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.formattedValue = $filter('currency')(newVal);
          } else if (scope.format === 'percent') {
            scope.formattedValue = newVal + '%';
          } else {
            scope.formattedValue = $filter('number')(newVal, 2);
          }
        });
      }
    };
  }]);
})();
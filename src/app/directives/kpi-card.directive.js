(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiCard', ['$filter', kpiCard]);
  function kpiCard($filter) {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        value: '=',
        format: '='
      },
      template: '<div class="kpi-card">' +
                '  <h3>{{title}}</h3>' +
                '  <div class="value">{{displayValue}}</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.$watch('value', function(newVal) {
          if (newVal !== undefined && newVal !== null) {
            if (scope.format === 'currency') {
              scope.displayValue = $filter('currency')(newVal);
            } else {
              scope.displayValue = newVal;
            }
          } else {
            scope.displayValue = '-';
          }
        });
      }
    };
  }
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiWidget', [kpiWidget]);
  function kpiWidget() {
    return {
      restrict: 'E',
      scope: {
        label: '=',
        value: '=',
        type: '=',
        icon: '=',
        trend: '='
      },
      template: '<div class="kpi-widget" ng-class="trend">' +
                '  <h4><span class="glyphicon" ng-class="icon"></span> {{label}}</h4>' +
                '  <div class="value">{{displayValue}}</div>' +
                '</div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.type === 'currency') {
            scope.displayValue = '₹' + (newVal || 0).toLocaleString('en-IN');
          } else {
            scope.displayValue = newVal || 0;
          }
        });
      }
    };
  }
})();
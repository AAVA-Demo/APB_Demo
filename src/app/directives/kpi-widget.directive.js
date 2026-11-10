(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('kpiWidget', ['$animate', function($animate) {
      return {
        restrict: 'E',
        scope: {
          kpiLabel: '=',
          kpiValue: '=',
          kpiFormat: '='
        },
        template: '<div class="kpi-widget">' +
                  '<div class="kpi-label">{{ kpiLabel }}</div>' +
                  '<div class="kpi-value" ng-class="{"ng-enter": animate}">{{ formattedValue }}</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.animate = false;
          scope.$watch('kpiValue', function(newVal, oldVal) {
            if (newVal !== oldVal) {
              scope.animate = true;
              setTimeout(function() {
                scope.animate = false;
                scope.$apply();
              }, 500);
            }
            scope.formattedValue = scope.formatValue(newVal);
          });
          scope.formatValue = function(value) {
            if (!value) return '$0.00';
            if (scope.kpiFormat === 'currency') {
              return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }
            return value;
          };
        }
      };
    }]);
})();
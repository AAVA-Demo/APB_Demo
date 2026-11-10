(function() {
  'use strict';
  angular.module('creditCardApp').directive('kpiCard', [function() {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        value: '=',
        format: '=',
        icon: '='
      },
      template: '<div class="kpi-card"><div><span class="glyphicon {{icon}}" style="font-size: 2em; color: #3498db;"></span></div><div class="kpi-label">{{title}}</div><div class="kpi-value">{{formattedValue}}</div></div>',
      link: function(scope, element, attrs) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.formattedValue = '$' + (newVal || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          } else if (scope.format === 'percentage') {
            scope.formattedValue = (newVal || 0).toFixed(2) + '%';
          } else {
            scope.formattedValue = newVal || 0;
          }
        });
      }
    };
  }]);
})();
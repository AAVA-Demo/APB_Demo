(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiWidget', [function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        value: '=',
        icon: '@',
        format: '@'
      },
      template: '<div class="kpi-card"><div class="row"><div class="col-xs-8"><h4>{{label}}</h4><h2>{{formattedValue}}</h2></div><div class="col-xs-4 text-right"><span class="glyphicon {{icon}}" style="font-size:48px;color:#007bff;"></span></div></div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.formattedValue = '$' + (newVal || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          } else if (scope.format === 'percentage') {
            scope.formattedValue = (newVal || 0) + '%';
          } else {
            scope.formattedValue = newVal || 0;
          }
        });
      }
    };
  }]);
})();
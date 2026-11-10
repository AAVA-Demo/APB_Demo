(function() {
  'use strict';
  angular.module('dashboardModule').directive('kpiWidget', [kpiWidget]);
  function kpiWidget() {
    return {
      restrict: 'E',
      scope: { title: '=', value: '=', format: '=' },
      template: '<div class="kpi-widget"><h3>{{title}}</h3><div class="value">{{displayValue}}</div></div>',
      link: function(scope) {
        scope.$watch('value', function(newVal) {
          if (scope.format === 'currency') {
            scope.displayValue = '$' + (newVal || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          } else {
            scope.displayValue = (newVal || 0).toLocaleString();
          }
        });
      }
    };
  }
})();
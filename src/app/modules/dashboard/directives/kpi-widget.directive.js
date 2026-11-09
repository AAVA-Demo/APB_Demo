(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiWidget', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '=',
          value: '=',
          format: '='
        },
        template: '<div class="kpi-widget panel panel-primary"><div class="panel-heading"><h4>{{label}}</h4></div><div class="panel-body"><h2>{{formattedValue}}</h2></div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '$' + (newVal || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            } else {
              scope.formattedValue = newVal || 0;
            }
          });
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('dashboardKpi', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          label: '=',
          value: '=',
          format: '='
        },
        template: '<div class="kpi-card panel panel-primary"><div class="panel-heading"><h4>{{label}}</h4></div><div class="panel-body"><h2>{{displayValue}}</h2></div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.displayValue = $filter('currency')(newVal || 0);
            } else {
              scope.displayValue = newVal || 0;
            }
          });
        }
      };
    }]);
})();
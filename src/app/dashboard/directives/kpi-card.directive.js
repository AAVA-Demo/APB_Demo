(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          value: '=',
          label: '@',
          icon: '@'
        },
        template: '<div class="kpi-card"><div class="kpi-value">{{formattedValue}}</div><div class="kpi-label"><i class="glyphicon glyphicon-{{icon}}"></i> {{label}}</div></div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (newVal !== undefined && newVal !== null) {
              scope.formattedValue = $filter('currency')(newVal, '$', 2);
            } else {
              scope.formattedValue = '$0.00';
            }
          });
        }
      };
    }]);
})();
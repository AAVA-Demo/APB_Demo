(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          format: '@'
        },
        templateUrl: 'src/app/dashboard/views/kpi-card.template.html',
        link: function(scope) {
          scope.formattedValue = function() {
            if (!scope.value && scope.value !== 0) return 'N/A';
            if (scope.format === 'currency') {
              return '$' + scope.value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            } else if (scope.format === 'percentage') {
              return scope.value.toFixed(2) + '%';
            }
            return scope.value.toString();
          };
        }
      };
    }]);
})();
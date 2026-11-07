(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          currency: '@',
          icon: '@',
          percentage: '=?'
        },
        template: '<div class="kpi-card">' +
                  '  <div class="kpi-label"><i class="glyphicon glyphicon-{{icon}}"></i> {{label}}</div>' +
                  '  <div class="kpi-value">{{currency}} {{value | number:0}}</div>' +
                  '  <div ng-if="percentage" class="kpi-label">{{percentage}}% Available</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.currency = scope.currency || '$';
        }
      };
    }]);
})();
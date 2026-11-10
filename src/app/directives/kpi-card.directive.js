(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .directive('kpiCard', [function() {
      return {
        restrict: 'A',
        scope: {
          kpiLabel: '@',
          kpiValue: '@',
          kpiIcon: '@'
        },
        template: '<div class="card shadow-sm h-100" touch-friendly>' +
                  '<div class="card-body text-center">' +
                  '<div class="display-4 mb-2">{{kpiIcon}}</div>' +
                  '<h6 class="card-subtitle mb-2 text-muted">{{kpiLabel}}</h6>' +
                  '<h4 class="card-title mb-0">{{kpiValue}}</h4>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {}
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.dashboard')
    .directive('dashboardSummary', [function() {
      return {
        restrict: 'E',
        scope: {
          kpiData: '='
        },
        templateUrl: 'src/app/dashboard/views/dashboard-summary.template.html'
      };
    }]);
})();
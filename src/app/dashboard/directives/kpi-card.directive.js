(function() {
  'use strict';
  angular.module('creditCardApp.dashboard')
    .directive('kpiCard', [kpiCard]);

  function kpiCard() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        label: '@',
        value: '=',
        subtitle: '@'
      },
      templateUrl: 'src/app/dashboard/views/kpi-card.template.html'
    };
  }
})();
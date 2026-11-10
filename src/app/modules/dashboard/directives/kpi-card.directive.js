(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@'
        },
        template: '<div class="card kpi-card p-3 mb-3">' +
                  '  <div class="d-flex align-items-center">' +
                  '    <i class="{{icon}} fa-2x mr-3"></i>' +
                  '    <div class="flex-grow-1">' +
                  '      <div class="kpi-label">{{label}}</div>' +
                  '      <div class="kpi-value">{{value | currency}}</div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>'
      };
    });
})();
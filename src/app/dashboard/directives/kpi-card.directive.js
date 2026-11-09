(function() {
  'use strict';
  angular.module('dashboardModule')
    .directive('kpiCard', function() {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          format: '@'
        },
        template: '<div class="kpi-card panel panel-default">' +
                  '  <div class="panel-body">' +
                  '    <div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div>' +
                  '    <div class="kpi-content">' +
                  '      <h4>{{label}}</h4>' +
                  '      <h2>{{formattedValue}}</h2>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (scope.format === 'currency') {
              scope.formattedValue = '$' + (newVal || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            } else if (scope.format === 'percentage') {
              scope.formattedValue = (newVal || 0).toFixed(1) + '%';
            } else {
              scope.formattedValue = newVal || 0;
            }
          });
        }
      };
    });
})();
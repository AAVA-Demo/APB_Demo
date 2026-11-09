(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('kpiWidget', ['$filter', function($filter) {
      return {
        restrict: 'E',
        scope: {
          label: '@',
          value: '=',
          icon: '@',
          trend: '@',
          trendValue: '=',
          format: '@'
        },
        template: '<div class="kpi-widget panel panel-default">' +
                  '  <div class="panel-body">' +
                  '    <div class="kpi-icon"><i class="fa {{icon}}"></i></div>' +
                  '    <div class="kpi-content">' +
                  '      <h4 class="kpi-label">{{label}}</h4>' +
                  '      <h2 class="kpi-value">{{formattedValue}}</h2>' +
                  '      <div class="kpi-trend" ng-if="trend">' +
                  '        <i class="fa" ng-class="{\'fa-arrow-up text-success\': trend === \'up\', \'fa-arrow-down text-danger\': trend === \'down\', \'fa-minus text-muted\': trend === \'neutral\'}"></i>' +
                  '        <span ng-if="trendValue">{{trendValue}}%</span>' +
                  '      </div>' +
                  '    </div>' +
                  '  </div>' +
                  '</div>',
        link: function(scope) {
          scope.$watch('value', function(newVal) {
            if (newVal !== undefined && newVal !== null) {
              if (scope.format === 'currency') {
                scope.formattedValue = $filter('currency')(newVal, '$');
              } else if (scope.format === 'percentage') {
                scope.formattedValue = $filter('number')(newVal, 1) + '%';
              } else {
                scope.formattedValue = $filter('number')(newVal, 0);
              }
            }
          });
        }
      };
    }]);
})();
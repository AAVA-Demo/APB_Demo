(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryBreakdown', [function() {
      return {
        restrict: 'E',
        scope: {
          categories: '='
        },
        template: '<div class="chart-container"><h4>Category Breakdown</h4><div class="category-item" ng-repeat="cat in categories"><div><strong>{{ cat.category }}</strong> - {{ cat.totalSpend | currency }} ({{ cat.percentOfTotal }}%)</div><div class="category-bar" ng-style="{width: cat.percentOfTotal + \'%\'}"></div></div></div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCardApp').directive('categoryBreakdown', ['$filter', function($filter) {
    return {
      restrict: 'E',
      scope: {
        categories: '=',
        onCategoryClick: '&'
      },
      template: '<div class="chart-container"><h4>Category Breakdown</h4><div class="category-row" ng-repeat="cat in categories track by cat.category" ng-click="onCategoryClick({category: cat.category})" style="cursor:pointer;"><strong>{{cat.category}}:</strong> {{cat.totalAmount | currency}} <span class="text-muted">({{cat.percentageOfTotal}}%)</span> <span class="badge">{{cat.transactionCount}} transactions</span></div></div>'
    };
  }]);
})();
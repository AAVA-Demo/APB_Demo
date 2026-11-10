(function() {
  'use strict';
  angular.module('creditCardApp').directive('categoryFilter', [function() {
    return {
      restrict: 'E',
      scope: {
        categories: '=',
        onSelect: '&'
      },
      template: '<div><div ng-repeat="cat in categories" class="category-badge" ng-style="{\"background-color\": getColor($index), \"color\": \"white\", \"cursor\": \"pointer\"}" ng-click="selectCategory(cat)">{{cat.categoryName}}<br><small>${{cat.totalAmount.toFixed(2)}} ({{cat.percentage}}%)</small></div></div>',
      link: function(scope, element, attrs) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#95a5a6'];
        
        scope.getColor = function(index) {
          return colors[index % colors.length];
        };
        
        scope.selectCategory = function(category) {
          scope.onSelect({ category: category.categoryName });
        };
      }
    };
  }]);
})();
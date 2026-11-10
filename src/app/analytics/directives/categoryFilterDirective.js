(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('categoryFilter', [function() {
      return {
        restrict: 'E',
        scope: {
          categories: '=',
          selectedCategories: '='
        },
        template: '<div class="filter-panel"><h4>Filter by Category</h4><div class="checkbox" ng-repeat="category in categories"><label><input type="checkbox" ng-model="selected[category]" ng-change="updateSelection()"> {{category}}</label></div></div>',
        link: function(scope) {
          scope.selected = {};
          scope.updateSelection = function() {
            scope.selectedCategories = Object.keys(scope.selected).filter(function(key) {
              return scope.selected[key];
            });
          };
        }
      };
    }]);
})();
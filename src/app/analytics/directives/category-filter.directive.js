(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryFilter', categoryFilter);
  categoryFilter.$inject = ['CategoryService'];
  function categoryFilter(CategoryService) {
    return {
      restrict: 'E',
      scope: {
        selectedCategories: '='
      },
      template: '<div><label>Categories</label><div ng-repeat="category in categories track by $index"><label class="checkbox-inline"><input type="checkbox" ng-model="selected[category]" ng-change="updateSelection()"> {{category}}</label></div></div>',
      link: function(scope) {
        scope.categories = CategoryService.getCategories();
        scope.selected = {};
        scope.selectedCategories = scope.selectedCategories || [];
        scope.selectedCategories.forEach(function(cat) {
          scope.selected[cat] = true;
        });
        scope.updateSelection = function() {
          scope.selectedCategories.length = 0;
          scope.categories.forEach(function(cat) {
            if (scope.selected[cat]) {
              scope.selectedCategories.push(cat);
            }
          });
        };
      }
    };
  }
})();
(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryFilter', function() {
      return {
        restrict: 'E',
        scope: {
          categories: '=',
          selectedCategories: '=',
          onFilter: '&'
        },
        template: '<div class="filter-section"><h6>Filter by Category</h6><div class="form-check" ng-repeat="cat in categories"><input class="form-check-input" type="checkbox" ng-model="selected[cat.category]" ng-change="updateFilter()" id="cat-{{$index}}"><label class="form-check-label" for="cat-{{$index}}">{{cat.category}}</label></div></div>',
        link: function(scope) {
          scope.selected = {};
          scope.$watch('categories', function(cats) {
            if (cats) {
              cats.forEach(function(c) {
                scope.selected[c.category] = true;
              });
            }
          });
          scope.updateFilter = function() {
            var selected = [];
            for (var key in scope.selected) {
              if (scope.selected[key]) selected.push(key);
            }
            scope.selectedCategories = selected;
            scope.onFilter({ selectedCategories: selected });
          };
        }
      };
    });
})();
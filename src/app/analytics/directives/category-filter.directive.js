(function() {
  'use strict';
  angular.module('app.analytics')
    .directive('categoryFilter', [function() {
      return {
        restrict: 'E',
        scope: {
          categories: '=',
          selectedCategories: '=',
          onChange: '&'
        },
        template: '<div class="filter-section">' +
                  '<h5>Filter by Category</h5>' +
                  '<div ng-repeat="cat in categories">' +
                  '<label><input type="checkbox" ng-model="selected[cat]" ng-change="updateSelection()"> {{cat}}</label>' +
                  '</div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          scope.selected = {};
          scope.selectedCategories.forEach(function(cat) {
            scope.selected[cat] = true;
          });
          scope.updateSelection = function() {
            var selectedCats = [];
            scope.categories.forEach(function(cat) {
              if (scope.selected[cat]) {
                selectedCats.push(cat);
              }
            });
            scope.onChange({ categories: selectedCats });
          };
        }
      };
    }]);
})();
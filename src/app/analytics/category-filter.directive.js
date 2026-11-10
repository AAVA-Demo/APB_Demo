(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryFilter', [function() {
    return {
      restrict: 'E',
      scope: { categories: '=', selectedCategories: '=', onFilter: '&' },
      template: '<div class="filter-panel"><h4>Filter by Category</h4><div ng-repeat="cat in categories"><label><input type="checkbox" ng-model="selection[cat]" ng-change="updateSelection()"> {{cat}}</label></div><button class="btn btn-primary" ng-click="applyFilter()">Apply Filter</button></div>',
      link: function(scope) {
        scope.selection = {};
        scope.updateSelection = function() {
          scope.selectedCategories = Object.keys(scope.selection).filter(function(key) {
            return scope.selection[key];
          });
        };
        scope.applyFilter = function() {
          scope.onFilter();
        };
      }
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('analyticsModule').directive('categoryFilter', [categoryFilter]);
  function categoryFilter() {
    return {
      restrict: 'E',
      scope: { selectedCategories: '=', onChange: '&' },
      template: '<div class="filter-panel"><h5>Filter Categories</h5><div class="row"><div class="col-md-3" ng-repeat="cat in categories"><label><input type="checkbox" ng-model="selection[cat]" ng-change="updateSelection()"> {{cat}}</label></div></div></div>',
      link: function(scope) {
        scope.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        scope.selection = {};
        scope.categories.forEach(function(cat) {
          scope.selection[cat] = scope.selectedCategories.indexOf(cat) !== -1;
        });
        scope.updateSelection = function() {
          scope.selectedCategories.length = 0;
          scope.categories.forEach(function(cat) {
            if (scope.selection[cat]) scope.selectedCategories.push(cat);
          });
          scope.onChange();
        };
      }
    };
  }
})();
(function() {
  'use strict';
  angular.module('cc.analytics')
    .directive('ccCategoryFilter', ['SPENDING_CATEGORIES', ccCategoryFilter]);
  function ccCategoryFilter(SPENDING_CATEGORIES) {
    return {
      restrict: 'E',
      scope: {
        onFilter: '&'
      },
      templateUrl: 'src/app/directives/templates/category-filter.html',
      link: function(scope) {
        scope.categories = SPENDING_CATEGORIES;
        scope.selectedCategory = null;
        scope.filterCategory = function(category) {
          scope.selectedCategory = category;
          scope.onFilter({ category: category });
        };
      }
    };
  }
})();
(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('categoryFilter', [function() {
      return {
        restrict: 'E',
        scope: {
          filter: '=',
          categories: '=',
          onApply: '&',
          onReset: '&'
        },
        templateUrl: 'src/app/analytics/views/category-filter.template.html'
      };
    }]);
})();
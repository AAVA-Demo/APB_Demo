(function() {
  'use strict';
  angular.module('creditCard.analyticsModule')
    .directive('categoryFilter', [function() {
      return {
        restrict: 'E',
        scope: {
          categories: '=',
          selectedCategory: '=',
          onFilter: '&',
          onClear: '&'
        },
        template: '<div class="filter-panel">' +
                  '<h4>Filter by Category</h4>' +
                  '<div>' +
                  '<button class="btn btn-sm" ng-class="{' +
                  '\'btn-primary\': !selectedCategory,' +
                  '\'btn-default\': selectedCategory' +
                  '}" ng-click="onClear()">All Categories</button>' +
                  '<button class="btn btn-sm" ng-class="{' +
                  '\'btn-primary\': selectedCategory === cat,' +
                  '\'btn-default\': selectedCategory !== cat' +
                  '}" ng-repeat="cat in categories" ng-click="onFilter({category: cat})">{{cat}}</button>' +
                  '</div>' +
                  '</div>'
      };
    }]);
})();
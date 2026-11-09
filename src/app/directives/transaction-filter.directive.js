(function() {
  'use strict';
  angular.module('creditCardApp')
    .directive('transactionFilter', [transactionFilter]);
  function transactionFilter() {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        cards: '=',
        onFilter: '&'
      },
      template: '<div class="filter-panel">' +
                '  <div class="row">' +
                '    <div class="col-sm-3">' +
                '      <label>Search</label>' +
                '      <input type="text" class="form-control" ng-model="filters.searchText" placeholder="Search merchant or category">' +
                '    </div>' +
                '    <div class="col-sm-3">' +
                '      <label>Card</label>' +
                '      <select class="form-control" ng-model="filters.selectedCard">' +
                '        <option value="">All Cards</option>' +
                '        <option ng-repeat="card in cards" value="{{card.id}}">{{card.name}} ****{{card.lastFourDigits}}</option>' +
                '      </select>' +
                '    </div>' +
                '    <div class="col-sm-3">' +
                '      <label>Start Date</label>' +
                '      <input type="date" class="form-control" ng-model="filters.startDate">' +
                '    </div>' +
                '    <div class="col-sm-3">' +
                '      <label>End Date</label>' +
                '      <input type="date" class="form-control" ng-model="filters.endDate">' +
                '    </div>' +
                '  </div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.$watch('filters', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            scope.onFilter();
          }
        }, true);
      }
    };
  }
})();
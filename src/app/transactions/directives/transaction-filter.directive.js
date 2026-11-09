(function() {
  'use strict';
  angular.module('app.transactions').directive('transactionFilter', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        filters: '=',
        onApply: '&'
      },
      template: '<div class="filter-panel">' +
                '  <div class="row">' +
                '    <div class="col-md-3">' +
                '      <label>Card</label>' +
                '      <select class="form-control" ng-model="filters.cardId">' +
                '        <option value="">All Cards</option>' +
                '        <option ng-repeat="card in cards" value="{{card.cardId}}">{{card.cardType}}</option>' +
                '      </select>' +
                '    </div>' +
                '    <div class="col-md-3">' +
                '      <label>Start Date</label>' +
                '      <input type="date" class="form-control" ng-model="filters.startDate">' +
                '    </div>' +
                '    <div class="col-md-3">' +
                '      <label>End Date</label>' +
                '      <input type="date" class="form-control" ng-model="filters.endDate">' +
                '    </div>' +
                '    <div class="col-md-3">' +
                '      <label>&nbsp;</label>' +
                '      <button class="btn btn-primary btn-block" ng-click="applyFilters()">Apply Filters</button>' +
                '    </div>' +
                '  </div>' +
                '</div>',
      link: function(scope) {
        scope.applyFilters = function() {
          scope.onApply();
        };
      }
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionFilter', [transactionFilter]);
  function transactionFilter() {
    return {
      restrict: 'E',
      scope: { filterCriteria: '=', cards: '=', onFilter: '&' },
      template: '<div class="filter-panel"><div class="row"><div class="col-md-3"><label>Start Date</label><input type="date" class="form-control" ng-model="filterCriteria.startDate" ng-change="onFilter()"></div><div class="col-md-3"><label>End Date</label><input type="date" class="form-control" ng-model="filterCriteria.endDate" ng-change="onFilter()"></div><div class="col-md-3"><label>Card</label><select class="form-control" ng-model="selectedCard" ng-change="updateCardFilter()"><option value="">All Cards</option><option ng-repeat="card in cards" value="{{card.cardId}}">{{card.cardNumber}}</option></select></div><div class="col-md-3"><label>Merchant</label><input type="text" class="form-control" ng-model="filterCriteria.merchant" ng-change="onFilter()" placeholder="Search merchant"></div></div></div>',
      link: function(scope) {
        scope.selectedCard = '';
        scope.updateCardFilter = function() {
          scope.filterCriteria.cardIds = scope.selectedCard ? [scope.selectedCard] : [];
          scope.onFilter();
        };
      }
    };
  }
})();
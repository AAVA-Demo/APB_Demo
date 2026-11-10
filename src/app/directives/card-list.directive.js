(function() {
  'use strict';
  angular.module('creditCardApp').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        search: '=',
        sortBy: '=',
        onSelect: '&'
      },
      template: '<div><div ng-repeat="card in filteredCards = (cards | filter:search | orderBy:sortBy) track by card.cardId" class="card-tile" ng-click="selectCard(card)"><div class="row"><div class="col-xs-8"><h4 style="margin-top: 0;">{{card.cardType}}</h4><p class="text-muted">{{card.cardNumber}}</p></div><div class="col-xs-4 text-right"><span class="label" ng-class="{\"label-success\": card.utilizationRate < 30, \"label-warning\": card.utilizationRate >= 30 && card.utilizationRate < 70, \"label-danger\": card.utilizationRate >= 70}">{{card.utilizationRate}}% Used</span></div></div><div class="row" style="margin-top: 10px;"><div class="col-xs-6"><small class="text-muted">Credit Limit</small><br><strong>${{card.creditLimit.toFixed(2)}}</strong></div><div class="col-xs-6"><small class="text-muted">Available</small><br><strong>${{card.availableCredit.toFixed(2)}}</strong></div></div><div class="row" style="margin-top: 10px;"><div class="col-xs-12"><small class="text-muted">Monthly Spend: <strong>${{card.monthlySpend.toFixed(2)}}</strong></small></div></div></div><div ng-if="filteredCards.length === 0" class="alert alert-info">No cards found matching your search.</div></div>',
      link: function(scope, element, attrs) {
        scope.selectCard = function(card) {
          scope.onSelect({ card: card });
        };
      }
    };
  }]);
})();
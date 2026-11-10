(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardListItem', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onSelect: '&'
        },
        template: '<div class="card-item" ng-click="selectCard()">' +
                  '<div class="card-number">{{card.cardType}} - {{card.cardNumber}}</div>' +
                  '<div><small class="text-muted">{{card.cardIssuer}}</small></div>' +
                  '<div class="card-details">' +
                  '<div class="card-detail-item">' +
                  '<div class="card-detail-label">Credit Limit</div>' +
                  '<div class="card-detail-value">${{card.creditLimit | number:0}}</div>' +
                  '</div>' +
                  '<div class="card-detail-item">' +
                  '<div class="card-detail-label">Available</div>' +
                  '<div class="card-detail-value">${{card.availableCredit | number:0}}</div>' +
                  '</div>' +
                  '<div class="card-detail-item">' +
                  '<div class="card-detail-label">Outstanding</div>' +
                  '<div class="card-detail-value">${{card.outstandingBalance | number:0}}</div>' +
                  '</div>' +
                  '<div class="card-detail-item">' +
                  '<div class="card-detail-label">Monthly Spend</div>' +
                  '<div class="card-detail-value">${{card.monthlySpend | number:0}}</div>' +
                  '</div>' +
                  '</div>' +
                  '<div ng-if="card.spendAnalysis" style="margin-top: 10px;">' +
                  '<small><strong>Trend:</strong> <span ng-class="{"text-success": card.spendAnalysis.spendTrend === "down", "text-danger": card.spendAnalysis.spendTrend === "up"}">{{card.spendAnalysis.spendTrend}}</span></small>' +
                  '<div ng-if="card.spendAnalysis.topCategories.length > 0">' +
                  '<small><strong>Top Categories:</strong> <span ng-repeat="cat in card.spendAnalysis.topCategories">{{cat.category}} (${{cat.amount | number:0}})<span ng-if="!$last">, </span></span></small>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
        link: function(scope) {
          scope.selectCard = function() {
            scope.onSelect({ card: scope.card });
          };
        }
      };
    }]);
})();
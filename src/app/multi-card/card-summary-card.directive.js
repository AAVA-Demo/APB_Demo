(function() {
  'use strict';
  angular.module('creditCard.multiCardModule')
    .directive('cardSummaryCard', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          onClick: '&'
        },
        template: '<div class="card-summary" ng-click="onClick({cardId: card.cardId})">' +
                  '<div class="row">' +
                  '<div class="col-xs-8">' +
                  '<div class="card-number">{{card.cardNumber}}</div>' +
                  '<div class="card-type">{{card.cardType}} - {{card.cardHolderName}}</div>' +
                  '</div>' +
                  '<div class="col-xs-4 text-right">' +
                  '<span class="label" ng-class="{' +
                  '\'label-success\': card.utilizationRate < 30,' +
                  '\'label-warning\': card.utilizationRate >= 30 && card.utilizationRate < 70,' +
                  '\'label-danger\': card.utilizationRate >= 70' +
                  '}">{{card.utilizationRate}}%</span>' +
                  '</div>' +
                  '</div>' +
                  '<hr style="margin: 10px 0;">' +
                  '<div class="row">' +
                  '<div class="col-xs-6">' +
                  '<small>Credit Limit</small><br>' +
                  '<strong>₹{{card.creditLimit | number}}</strong>' +
                  '</div>' +
                  '<div class="col-xs-6">' +
                  '<small>Available</small><br>' +
                  '<strong>₹{{card.availableCredit | number}}</strong>' +
                  '</div>' +
                  '</div>' +
                  '<div class="row" style="margin-top: 10px;">' +
                  '<div class="col-xs-6">' +
                  '<small>Outstanding</small><br>' +
                  '<strong>₹{{card.outstandingAmount | number}}</strong>' +
                  '</div>' +
                  '<div class="col-xs-6">' +
                  '<small>Monthly Spend</small><br>' +
                  '<strong>₹{{card.monthlySpend | number}}</strong>' +
                  '</div>' +
                  '</div>' +
                  '</div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardList', [cardList]);
  function cardList() {
    return {
      restrict: 'E',
      scope: {
        cards: '=',
        onSelect: '&',
        onView: '&',
        selectedCards: '='
      },
      template: '<div class="row">' +
                '  <div class="col-md-6" ng-repeat="card in cards">' +
                '    <div class="card-item" ng-click="viewCard(card.id)">' +
                '      <div class="checkbox" ng-click="$event.stopPropagation();">' +
                '        <label><input type="checkbox" ng-checked="isSelected(card)" ng-click="selectCard(card)"> Select for comparison</label>' +
                '      </div>' +
                '      <h3>{{card.bankName}}</h3>' +
                '      <p class="card-number">**** **** **** {{card.cardNumber}}</p>' +
                '      <p><strong>Type:</strong> {{card.cardType}}</p>' +
                '      <div class="row">' +
                '        <div class="col-xs-6"><small>Credit Limit</small><br><strong>₹{{card.creditLimit | number:0}}</strong></div>' +
                '        <div class="col-xs-6"><small>Available</small><br><strong>₹{{card.availableCredit | number:0}}</strong></div>' +
                '      </div>' +
                '      <div class="row" style="margin-top: 10px;">' +
                '        <div class="col-xs-6"><small>Outstanding</small><br><strong>₹{{card.outstandingBalance | number:0}}</strong></div>' +
                '        <div class="col-xs-6"><small>Monthly Spend</small><br><strong>₹{{card.monthlySpend | number:0}}</strong></div>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>',
      link: function(scope) {
        scope.viewCard = function(cardId) {
          scope.onView({ cardId: cardId });
        };
        scope.selectCard = function(card) {
          scope.onSelect({ card: card });
        };
        scope.isSelected = function(card) {
          return scope.selectedCards.indexOf(card) > -1;
        };
      }
    };
  }
})();
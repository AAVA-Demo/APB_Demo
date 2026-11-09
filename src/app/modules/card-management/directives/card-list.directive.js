(function() {
  'use strict';
  angular.module('cardManagementModule')
    .directive('cardList', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '=',
          onSelect: '&'
        },
        template: '<div class="row"><div class="col-md-4 col-sm-6" ng-repeat="card in cards"><div class="card-item panel panel-default" ng-click="selectCard(card)"><div class="panel-body"><div class="card-type"><span class="label label-primary">{{card.cardType}}</span> <span class="label" ng-class="{\"label-success\": card.status === \"Active\", \"label-danger\": card.status !== \"Active\"}">{{card.status}}</span></div><h4>{{card.cardHolderName}}</h4><p class="card-number">{{card.cardNumber}}</p><div class="card-details"><div><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</div><div><strong>Available:</strong> {{card.availableCredit | currency}}</div><div><strong>Outstanding:</strong> {{card.outstandingAmount | currency}}</div></div><div class="card-expiry"><small>Expires: {{card.expiryDate}}</small></div></div></div></div></div>',
        link: function(scope) {
          scope.selectCard = function(card) {
            scope.onSelect({ cardId: card.cardId });
          };
        }
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('app.dashboard')
    .directive('creditCardList', [function() {
      return {
        restrict: 'E',
        scope: {
          cards: '='
        },
        template: '<div><div class="card-item" ng-repeat="card in cards track by card.cardId"><h4>{{card.cardName}} <small>{{card.cardNumber}}</small></h4><div class="row"><div class="col-xs-6 col-sm-3"><strong>Limit:</strong> ${{card.creditLimit | number:2}}</div><div class="col-xs-6 col-sm-3"><strong>Balance:</strong> ${{card.currentBalance | number:2}}</div><div class="col-xs-6 col-sm-3"><strong>Available:</strong> ${{card.availableCredit | number:2}}</div><div class="col-xs-6 col-sm-3"><strong>Outstanding:</strong> ${{card.outstandingAmount | number:2}}</div></div></div></div>'
      };
    }]);
})();
(function() {
  'use strict';
  angular.module('app.dashboard').directive('cardList', [function() {
    return {
      restrict: 'E',
      scope: {
        cards: '='
      },
      template: '<div>' +
                '  <h3>Your Credit Cards</h3>' +
                '  <div class="card-item" ng-repeat="card in cards">' +
                '    <div class="row">' +
                '      <div class="col-md-3"><strong>{{card.cardType}}</strong><br><small>{{card.cardNumber}}</small></div>' +
                '      <div class="col-md-3"><span class="text-muted">Credit Limit:</span><br><strong>${{card.creditLimit | number:2}}</strong></div>' +
                '      <div class="col-md-3"><span class="text-muted">Available:</span><br><strong class="text-success">${{card.availableCredit | number:2}}</strong></div>' +
                '      <div class="col-md-3"><span class="text-muted">Outstanding:</span><br><strong class="text-danger">${{card.outstandingAmount | number:2}}</strong></div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
    };
  }]);
})();
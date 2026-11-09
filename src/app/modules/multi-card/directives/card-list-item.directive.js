(function() {
  'use strict';
  angular.module('multiCardManagement').directive('cardListItem', ['$filter', function($filter) {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onSelect: '&',
        isSelected: '&'
      },
      template: '<div class="card-item" ng-click="onSelect({card: card})" ng-class="{\"bg-info\": isSelected({card: card})}"><div class="row"><div class="col-md-6"><div class="card-number">{{card.cardNumber}}</div><div><strong>{{card.cardType}}</strong> - {{card.issuer}}</div><div class="text-muted">Expires: {{card.expiryDate | date:\'MM/yyyy\'}}</div></div><div class="col-md-3"><div><strong>Credit Limit:</strong> {{card.creditLimit | currency}}</div><div><strong>Available:</strong> {{card.availableCredit | currency}}</div></div><div class="col-md-3"><div><strong>Balance:</strong> {{card.currentBalance | currency}}</div><div><span class="label" ng-class="{\"label-success\": card.status === \'Active\', \"label-danger\": card.status !== \'Active\'}">{{card.status}}</span></div></div></div></div>',
      link: function(scope, element, attrs) {}
    };
  }]);
})();
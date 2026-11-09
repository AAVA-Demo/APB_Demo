(function() {
  'use strict';
  angular.module('creditCard.multiCard').directive('cardDetail', [function() {
    return {
      restrict: 'E',
      scope: {
        card: '=',
        onClose: '&'
      },
      template: '<div class="modal" style="display: block; background: rgba(0,0,0,0.5);"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="onClose()">&times;</button><h4 class="modal-title">Card Details</h4></div><div class="modal-body"><h5>{{card.cardType}} {{card.cardNumber}}</h5><p><strong>Credit Limit:</strong> ₹{{card.creditLimit | number}}</p><p><strong>Outstanding Balance:</strong> ₹{{card.outstandingBalance | number}}</p><p><strong>Available Credit:</strong> ₹{{card.availableCredit | number}}</p><p><strong>Utilization Rate:</strong> {{card.utilizationRate}}%</p><p><strong>Monthly Spend:</strong> ₹{{card.monthlySpend | number}}</p><p><strong>Transaction Count:</strong> {{card.transactionCount}}</p><h5>Category Breakdown</h5><div ng-repeat="cat in card.categoryBreakdown" class="category-item">{{cat.category}}<span class="amount-badge">₹{{cat.amount | number}}</span></div></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="onClose()">Close</button></div></div></div></div>'
    };
  }]);
})();
(function() {
  'use strict';
  angular.module('creditCard.management')
    .directive('cardDetail', [function() {
      return {
        restrict: 'E',
        scope: {
          card: '=',
          analytics: '='
        },
        template: '<div ng-if="card"><div class="kpi-card"><h3>{{card.cardType}} {{card.cardNumber}}</h3><hr><div class="row"><div class="col-sm-6"><p><strong>Card Holder:</strong> {{card.cardHolderName}}</p><p><strong>Expiry:</strong> {{card.expiryDate}}</p><p><strong>Status:</strong> <span class="label label-success" ng-if="card.isActive">Active</span></p></div><div class="col-sm-6"><p><strong>Credit Limit:</strong> {{card.creditLimit | currency:"₹"}}</p><p><strong>Available Credit:</strong> {{card.availableCredit | currency:"₹"}}</p><p><strong>Outstanding:</strong> {{card.outstandingBalance | currency:"₹"}}</p><p><strong>Monthly Spend:</strong> {{card.monthlySpend | currency:"₹"}}</p></div></div><div ng-if="analytics"><hr><h4>Monthly Trends</h4><div class="row"><div class="col-sm-4" ng-repeat="trend in analytics.monthlyTrends"><div class="text-center"><strong>{{trend.month}}</strong><br>{{trend.spend | currency:"₹"}}</div></div></div><hr><h4>Category Breakdown</h4><ul><li ng-repeat="(category, amount) in analytics.categoryBreakdown">{{category}}: {{amount | currency:"₹"}}</li></ul></div></div></div><div ng-if="!card" class="text-center text-muted" style="padding: 40px;">Select a card to view details</div>'
      };
    }]);
})();
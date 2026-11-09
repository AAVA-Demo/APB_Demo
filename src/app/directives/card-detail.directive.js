(function(){
'use strict';
angular.module('creditCardApp').directive('cardDetailDirective',[function(){
return{
restrict:'E',
scope:{card:'=',spending:'='},
template:'<div class="panel panel-primary"><div class="panel-heading"><h4>{{card.cardType}} - {{card.maskedNumber}}</h4></div><div class="panel-body"><div class="row"><div class="col-md-6"><h5>Card Details</h5><table class="table table-condensed"><tr><td>Credit Limit</td><td><strong>{{card.creditLimit | currency:"₹"}}</strong></td></tr><tr><td>Available Credit</td><td><strong>{{card.availableCredit | currency:"₹"}}</strong></td></tr><tr><td>Current Balance</td><td><strong>{{card.currentBalance | currency:"₹"}}</strong></td></tr><tr><td>Utilization Rate</td><td><strong>{{card.utilizationRate}}%</strong></td></tr><tr><td>Expiry Date</td><td><strong>{{card.expiryDate}}</strong></td></tr></table></div><div class="col-md-6"><h5>Spending Summary</h5><div ng-if="spending"><p><strong>Monthly Spend:</strong> {{spending.monthlySpend | currency:"₹"}}</p><h6>Recent Transactions</h6><ul class="list-group"><li class="list-group-item" ng-repeat="txn in spending.transactions"><strong>{{txn.category}}</strong> - {{txn.amount | currency:"₹"}}<br><small>{{txn.date | date:"short"}}</small></li></ul></div><div ng-if="!spending"><p class="text-muted">Loading spending data...</p></div></div></div></div></div>'
};
}]);
})();
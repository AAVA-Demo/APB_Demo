(function(){
'use strict';
angular.module('creditCard.portfolio').directive('cardComparisonWidget',[function(){
return{restrict:'E',scope:{cards:'=',spending:'='},template:'<div class="card-comparison"><h3>Card Comparison</h3><table class="table comparison-table"><thead><tr><th>Card</th><th>Credit Limit</th><th>Available Credit</th><th>Outstanding</th><th>Monthly Spend</th><th>Utilization</th></tr></thead><tbody><tr ng-repeat="card in cards"><td>{{card.cardHolderName}}<br><small>****{{card.cardNumber.slice(-4)}}</small></td><td>{{card.creditLimit|currency}}</td><td>{{card.availableCredit|currency}}</td><td>{{card.outstandingAmount|currency}}</td><td>{{getSpending(card.cardId).monthlySpend|currency}}</td><td>{{((card.outstandingAmount/card.creditLimit)*100).toFixed(2)}}%</td></tr></tbody></table></div>',link:function(scope){
scope.getSpending=function(cardId){
if(!scope.spending)return{monthlySpend:0};
return scope.spending.get(cardId)||{monthlySpend:0};
};
}};
}]);
})();
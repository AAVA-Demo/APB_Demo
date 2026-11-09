(function(){
'use strict';
angular.module('creditCardApp').directive('transactionList',[function(){
return{
restrict:'E',
scope:{
transactions:'='
},
template:'<div class="table-responsive"><table class="table table-striped table-hover"><thead><tr><th>Date</th><th>Card</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr ng-repeat="txn in transactions track by txn.transactionId"><td>{{txn.transactionDate|date:\'short\'}}</td><td>{{txn.cardNumber}}</td><td>{{txn.merchantName}}</td><td>{{txn.category}}</td><td>${{txn.amount|number:2}}</td><td><span class="label label-success">{{txn.status}}</span></td></tr><tr ng-if="transactions.length===0"><td colspan="6" class="text-center">No transactions found</td></tr></tbody></table></div>'
};
}]);
})();
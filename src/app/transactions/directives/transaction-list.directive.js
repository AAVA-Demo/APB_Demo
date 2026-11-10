(function(){
'use strict';
angular.module('transactionsModule').directive('transactionList',[function(){
return{
restrict:'E',scope:{transactions:'='},template:'<div class="transaction-list"><table><thead><tr><th>Date</th><th>Merchant</th><th>Amount</th><th>Card</th><th>Status</th></tr></thead><tbody><tr ng-repeat="txn in transactions track by txn.id"><td>{{txn.date|date:"short"}}</td><td>{{txn.merchant}}</td><td>{{txn.amount|currency}}</td><td>{{txn.cardName}}</td><td>{{txn.status}}</td></tr></tbody></table></div>'
};
}]);
})();
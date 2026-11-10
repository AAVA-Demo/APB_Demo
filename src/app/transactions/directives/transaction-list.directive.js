(function(){
'use strict';
angular.module('app.transactions').directive('transactionList',[function(){
return{
restrict:'E',
scope:{transactions:'=',onSelect:'&'},
template:'<div class="table-responsive">'+
'<table class="table table-striped table-hover">'+
'<thead>'+
'<tr>'+
'<th>Date/Time</th>'+
'<th>Card</th>'+
'<th>Merchant</th>'+
'<th>Category</th>'+
'<th>Amount</th>'+
'<th>Status</th>'+
'<th>Action</th>'+
'</tr>'+
'</thead>'+
'<tbody>'+
'<tr ng-if="transactions.length===0">'+
'<td colspan="7" class="text-center">No transactions found</td>'+
'</tr>'+
'<tr ng-repeat="txn in transactions" ng-click="selectTransaction(txn)" style="cursor:pointer;">'+
'<td>{{txn.timestamp|date:"MMM dd, yyyy HH:mm"}}</td>'+
'<td>{{txn.cardNumber}}</td>'+
'<td>{{txn.merchantName}}</td>'+
'<td>{{txn.merchantCategory}}</td>'+
'<td>{{txn.amount|currency}}</td>'+
'<td><span class="label label-success">{{txn.status}}</span></td>'+
'<td><button class="btn btn-xs btn-info" ng-click="selectTransaction(txn);$event.stopPropagation();">View</button></td>'+
'</tr>'+
'</tbody>'+
'</table>'+
'</div>',
link:function(scope,element,attrs){
scope.selectTransaction=function(txn){
scope.onSelect({transaction:txn});
};
}
};
}]);
})();
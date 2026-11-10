(function(){'use strict';angular.module('transactionManagement').directive('transactionList',[function(){return{restrict:'E',scope:{transactions:'=',searchText:'='},template:'<table class="table table-striped transaction-table">'+
'<thead><tr>'+
'<th>Date</th>'+
'<th>Card</th>'+
'<th>Merchant</th>'+
'<th>Category</th>'+
'<th>Amount</th>'+
'<th>Status</th>'+
'</tr></thead>'+
'<tbody>'+
'<tr ng-repeat="txn in transactions|filter:searchText">'+
'<td>{{txn.date|date:"dd-MMM-yyyy"}}</td>'+
'<td>{{txn.cardNumber}}</td>'+
'<td>{{txn.merchantName}}</td>'+
'<td>{{txn.category}}</td>'+
'<td>₹{{txn.amount|number:0}}</td>'+
'<td><span class="label label-success">{{txn.status}}</span></td>'+
'</tr>'+
'<tr ng-if="(transactions|filter:searchText).length===0"><td colspan="6" class="text-center">No transactions found</td></tr>'+
'</tbody>'+
'</table>'};}]);})();
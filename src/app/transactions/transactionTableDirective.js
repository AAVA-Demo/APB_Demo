(function(){
'use strict';
angular.module('transactionModule').directive('transactionTable',[function(){
return{
restrict:'E',
scope:{transactions:'=',onSelect:'&'},
template:'<table class="table table-striped table-hover">'+
'<thead>'+
'<tr>'+
'<th>Date</th>'+
'<th>Merchant</th>'+
'<th>Category</th>'+
'<th>Amount</th>'+
'<th>Card</th>'+
'</tr>'+
'</thead>'+
'<tbody>'+
'<tr ng-repeat="t in transactions track by t.transactionId" ng-click="selectTransaction(t.transactionId)" style="cursor:pointer">'+
'<td>{{t.transactionDate | date:"short"}}</td>'+
'<td>{{t.merchant}}</td>'+
'<td><span class="category-badge">{{t.category}}</span></td>'+
'<td>${{t.amount | number:2}}</td>'+
'<td>{{t.cardNumber}}</td>'+
'</tr>'+
'</tbody>'+
'</table>',
link:function(scope){
scope.selectTransaction=function(transactionId){
if(scope.onSelect){
scope.onSelect({transactionId:transactionId});
}
};
}
};
}]);
})();
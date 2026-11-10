(function(){
'use strict';
angular.module('app.transactions').directive('transactionDetail',[function(){
return{
restrict:'E',
scope:{transaction:'=',onClose:'&'},
template:'<div class="modal" ng-show="transaction" style="display:block;" ng-style="{display:transaction?\'block\':\'none\'}" tabindex="-1" role="dialog">'+
'<div class="modal-dialog" role="document">'+
'<div class="modal-content">'+
'<div class="modal-header">'+
'<button type="button" class="close" ng-click="close()">&times;</button>'+
'<h4 class="modal-title">Transaction Details</h4>'+
'</div>'+
'<div class="modal-body" ng-if="transaction">'+
'<table class="table table-bordered">'+
'<tr><th>Transaction ID</th><td>{{transaction.transactionId}}</td></tr>'+
'<tr><th>Card Number</th><td>{{transaction.cardNumber}}</td></tr>'+
'<tr><th>Date & Time</th><td>{{transaction.timestamp|date:"MMM dd, yyyy HH:mm:ss"}}</td></tr>'+
'<tr><th>Merchant Name</th><td>{{transaction.merchantName}}</td></tr>'+
'<tr><th>Category</th><td>{{transaction.merchantCategory}}</td></tr>'+
'<tr><th>Amount</th><td>{{transaction.amount|currency}}</td></tr>'+
'<tr><th>Type</th><td>{{transaction.transactionType}}</td></tr>'+
'<tr><th>Status</th><td><span class="label label-success">{{transaction.status}}</span></td></tr>'+
'</table>'+
'</div>'+
'<div class="modal-footer">'+
'<button type="button" class="btn btn-default" ng-click="close()">Close</button>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'<div class="modal-backdrop fade in" ng-show="transaction"></div>',
link:function(scope,element,attrs){
scope.close=function(){
scope.onClose();
};
}
};
}]);
})();
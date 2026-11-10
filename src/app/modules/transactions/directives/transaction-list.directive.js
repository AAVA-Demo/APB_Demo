(function(){
'use strict';
angular.module('creditCard.transactions').directive('transactionList',[function(){
return{restrict:'E',scope:{transactions:'='},template:'<div><div ng-if="!transactions||transactions.length===0" class="alert alert-info">No transactions found</div><div ng-repeat="txn in transactions" class="transaction-row"><div class="row"><div class="col-sm-3"><strong>{{txn.date|date:"dd MMM yyyy"}}</strong></div><div class="col-sm-3">{{txn.merchant}}</div><div class="col-sm-2">{{txn.category}}</div><div class="col-sm-2">{{txn.cardName}}</div><div class="col-sm-2 text-right"><strong>₹{{txn.amount|number:2}}</strong></div></div></div></div>'};
}]);
})();
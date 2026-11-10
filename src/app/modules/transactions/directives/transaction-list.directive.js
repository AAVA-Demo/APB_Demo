(function(){
'use strict';
angular.module('creditCard.transactions').directive('transactionList',[function(){
return{
restrict:'E',scope:{transactions:'=',pagination:'=',onPageChange:'&'},template:'<div class="transaction-list"><div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th>Date</th><th>Card</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody><tr ng-repeat="txn in transactions"><td>{{txn.date | date:"short"}}</td><td>{{txn.cardName}}</td><td>{{txn.merchant}}</td><td>{{txn.category}}</td><td>{{txn.amount | currency}}</td><td><span class="label" ng-class="{\"label-success\":txn.status===\"Completed\",\"label-warning\":txn.status===\"Pending\",\"label-danger\":txn.status===\"Failed\"}">{{txn.status}}</span></td></tr><tr ng-if="transactions.length===0"><td colspan="6" class="text-center">No transactions found.</td></tr></tbody></table></div><div class="text-center" ng-if="pagination.totalRecords>pagination.pageSize"><ul class="pagination"><li ng-class="{disabled:pagination.currentPage===1}"><a ng-click="pagination.currentPage>1 && onPageChange({page:pagination.currentPage-1})">&laquo;</a></li><li ng-repeat="page in [] | range:1:(pagination.totalRecords/pagination.pageSize)+1" ng-class="{active:page===pagination.currentPage}"><a ng-click="onPageChange({page:page})">{{page}}</a></li><li ng-class="{disabled:pagination.currentPage>=(pagination.totalRecords/pagination.pageSize)}"><a ng-click="pagination.currentPage<(pagination.totalRecords/pagination.pageSize) && onPageChange({page:pagination.currentPage+1})">&raquo;</a></li></ul></div></div>'};
}]).filter('range',[function(){
return function(input,start,end){
for(var i=start;i<end;i++){input.push(i);}
return input;
};
}]);
})();
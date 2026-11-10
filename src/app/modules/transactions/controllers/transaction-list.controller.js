(function(){
'use strict';
angular.module('transactionModule').controller('TransactionListController',['TransactionService','AuthService','$scope','$filter','$location',function(TransactionService,AuthService,$scope,$filter){
var vm=this;
vm.transactions=[];
vm.filteredTransactions=[];
vm.loading=true;
vm.filters={cardIds:[],startDate:null,endDate:null,categories:[],minAmount:null,maxAmount:null};
var userContext=AuthService.getUserContext();
function loadTransactions(){
vm.loading=true;
TransactionService.getTransactions(userContext.userId,vm.filters).then(function(transactions){
vm.transactions=transactions;
vm.filteredTransactions=transactions;
$scope.$apply();
vm.loading=false;
},function(error){
vm.loading=false;
});
}
vm.applyFilters=function(){
vm.filteredTransactions=$filter('filter')(vm.transactions,function(txn){
var match=true;
if(vm.filters.cardIds.length>0&&vm.filters.cardIds.indexOf(txn.cardId)===-1){match=false;}
if(vm.filters.minAmount&&txn.amount<vm.filters.minAmount){match=false;}
if(vm.filters.maxAmount&&txn.amount>vm.filters.maxAmount){match=false;}
return match;
});
};
vm.viewDetail=function(transactionId){
window.location.href='#!/transactions/'+transactionId;
};
loadTransactions();
}]);
})();
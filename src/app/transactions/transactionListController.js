(function(){
'use strict';
angular.module('transactionModule').controller('transactionListController',['transactionService','searchFilterService','$location',function(transactionService,searchFilterService,$location){
var vm=this;
vm.transactions=[];
vm.filteredTransactions=[];
vm.loading=true;
vm.error=null;
vm.filter={dateFrom:null,dateTo:null,cardId:null,minAmount:null,maxAmount:null,merchant:null,category:null};
vm.currentPage=1;
vm.pageSize=50;
vm.applyFilter=function(){
vm.filteredTransactions=searchFilterService.applyFilter(vm.transactions,vm.filter);
vm.currentPage=1;
};
vm.viewTransaction=function(transactionId){
$location.path('/transactions/'+transactionId);
};
vm.getPageTransactions=function(){
var start=(vm.currentPage-1)*vm.pageSize;
var end=start+vm.pageSize;
return vm.filteredTransactions.slice(start,end);
};
vm.getTotalPages=function(){
return Math.ceil(vm.filteredTransactions.length/vm.pageSize);
};
vm.nextPage=function(){
if(vm.currentPage<vm.getTotalPages()){
vm.currentPage++;
}
};
vm.prevPage=function(){
if(vm.currentPage>1){
vm.currentPage--;
}
};
function init(){
transactionService.getTransactions().then(function(transactions){
vm.transactions=transactions;
vm.filteredTransactions=transactions;
vm.loading=false;
},function(error){
vm.error='Failed to load transactions';
vm.loading=false;
});
}
init();
}]);
})();
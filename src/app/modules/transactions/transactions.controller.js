(function(){
'use strict';
angular.module('app.transactions').controller('TransactionController',['$scope','TransactionService','SearchFilterService','PaginationService',function($scope,TransactionService,SearchFilterService,PaginationService){
var vm=this;
vm.transactions=[];
vm.filteredTransactions=[];
vm.displayedTransactions=[];
vm.loading=true;
vm.error=null;
vm.filterCriteria={cardId:'',startDate:null,endDate:null,minAmount:null,maxAmount:null,merchantName:'',category:''};
vm.pagination={currentPage:1,pageSize:50,totalPages:0,totalCount:0};
vm.applyFilters=applyFilters;
vm.clearFilters=clearFilters;
vm.nextPage=nextPage;
vm.prevPage=prevPage;
function init(){
loadTransactions();
}
function loadTransactions(){
vm.loading=true;
TransactionService.getTransactions(vm.pagination.currentPage,vm.pagination.pageSize).then(function(data){
vm.transactions=data.transactions;
vm.pagination.totalCount=data.totalCount;
vm.pagination.totalPages=Math.ceil(data.totalCount/vm.pagination.pageSize);
vm.filteredTransactions=vm.transactions;
vm.displayedTransactions=vm.transactions;
vm.loading=false;
},function(err){
vm.error='Failed to load transactions';
vm.loading=false;
});
}
function applyFilters(){
vm.filteredTransactions=SearchFilterService.applyFilters(vm.transactions,vm.filterCriteria);
vm.displayedTransactions=vm.filteredTransactions;
}
function clearFilters(){
vm.filterCriteria={cardId:'',startDate:null,endDate:null,minAmount:null,maxAmount:null,merchantName:'',category:''};
vm.filteredTransactions=vm.transactions;
vm.displayedTransactions=vm.transactions;
}
function nextPage(){
if(vm.pagination.currentPage<vm.pagination.totalPages){
vm.pagination.currentPage++;
loadTransactions();
}
}
function prevPage(){
if(vm.pagination.currentPage>1){
vm.pagination.currentPage--;
loadTransactions();
}
}
init();
}]);
})();
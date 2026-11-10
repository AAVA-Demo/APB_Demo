(function(){
'use strict';
angular.module('transactionManagement').controller('TransactionController',TransactionController);
TransactionController.$inject=['TransactionManagementService','$scope'];
function TransactionController(TransactionManagementService,$scope){
var vm=this;
vm.transactions=[];
vm.trends=[];
vm.pagination={currentPage:1,pageSize:20,totalRecords:0,totalPages:0};
vm.loading=true;
vm.error=null;
vm.sortField='date';
vm.sortReverse=true;
vm.goToPage=goToPage;
vm.sortBy=sortBy;
activate();
function activate(){
loadTransactions(vm.pagination.currentPage,vm.pagination.pageSize);
}
function loadTransactions(page,pageSize){
vm.loading=true;
TransactionManagementService.getTransactions(page,pageSize).then(function(data){
vm.transactions=data.transactions;
vm.trends=data.trends;
vm.pagination=data.pagination;
vm.loading=false;
},function(err){
vm.error='Failed to load transactions';
vm.loading=false;
});
}
function goToPage(page){
if(page>=1&&page<=vm.pagination.totalPages){
loadTransactions(page,vm.pagination.pageSize);
}
}
function sortBy(field){
if(vm.sortField===field){
vm.sortReverse=!vm.sortReverse;
}else{
vm.sortField=field;
vm.sortReverse=false;
}
}
}
})();
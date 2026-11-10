(function(){
'use strict';
angular.module('transactionModule').controller('TransactionListController',['$scope','$timeout','TransactionManagementService','CreditCardService',function($scope,$timeout,TransactionManagementService,CreditCardService){
var vm=this;
vm.transactions=[];
vm.pagination={currentPage:1,pageSize:20,totalRecords:0,totalPages:0};
vm.filterCriteria={cardId:'',dateFrom:'',dateTo:'',searchTerm:'',category:'',minAmount:'',maxAmount:''};
vm.cards=[];
vm.loading=true;
vm.error=null;
var searchTimeout;
function init(){
loadCards();
loadTransactions();
}
function loadCards(){
CreditCardService.getAllCards().then(function(cards){
vm.cards=cards;
},function(error){
console.error('Failed to load cards',error);
});
}
function loadTransactions(){
vm.loading=true;
vm.error=null;
TransactionManagementService.getTransactions(vm.pagination.currentPage,vm.pagination.pageSize).then(function(result){
vm.transactions=result.transactions;
vm.pagination=result.pagination;
vm.loading=false;
},function(error){
vm.error='Failed to load transactions.';
vm.loading=false;
});
}
vm.applyFilter=function(){
vm.pagination.currentPage=1;
vm.loading=true;
vm.error=null;
TransactionManagementService.getFilteredTransactions(vm.filterCriteria,vm.pagination.currentPage,vm.pagination.pageSize).then(function(result){
vm.transactions=result.transactions;
vm.pagination=result.pagination;
vm.loading=false;
},function(error){
vm.error='Failed to apply filter.';
vm.loading=false;
});
};
vm.onSearchChange=function(){
if(searchTimeout){
$timeout.cancel(searchTimeout);
}
searchTimeout=$timeout(function(){
vm.applyFilter();
},300);
};
vm.changePage=function(page){
if(page<1||page>vm.pagination.totalPages)return;
vm.pagination.currentPage=page;
if(vm.hasActiveFilter()){
vm.applyFilter();
}else{
loadTransactions();
}
};
vm.hasActiveFilter=function(){
return vm.filterCriteria.cardId||vm.filterCriteria.dateFrom||vm.filterCriteria.dateTo||vm.filterCriteria.searchTerm||vm.filterCriteria.category||vm.filterCriteria.minAmount||vm.filterCriteria.maxAmount;
};
vm.clearFilter=function(){
vm.filterCriteria={cardId:'',dateFrom:'',dateTo:'',searchTerm:'',category:'',minAmount:'',maxAmount:''};
vm.pagination.currentPage=1;
loadTransactions();
};
init();
}]);
})();
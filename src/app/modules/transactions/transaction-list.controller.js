(function(){
'use strict';
angular.module('creditCard.transactions').controller('TransactionListController',['$scope','$location','TransactionService',function($scope,$location,TransactionService){
var vm=this;
vm.transactions=[];
vm.loading=false;
vm.error=null;
vm.currentPage=1;
vm.pageSize=50;
vm.totalItems=0;
vm.filters={cardIds:[],categories:[],dateRange:{startDate:null,endDate:null},amountRange:{min:null,max:null},searchTerm:''};
vm.loadTransactions=function(){
vm.loading=true;
vm.error=null;
var params={userId:'user123',page:vm.currentPage,pageSize:vm.pageSize,filters:vm.filters};
TransactionService.getTransactions(params).then(function(data){
vm.transactions=data.transactions;
vm.totalItems=data.total;
vm.loading=false;
},function(err){
vm.error='Failed to load transactions. Please try again.';
vm.loading=false;
});
};
vm.applyFilters=function(filters){
vm.filters=filters;
vm.currentPage=1;
vm.loadTransactions();
};
vm.pageChanged=function(){
vm.loadTransactions();
};
vm.viewDetail=function(transactionId){
$location.path('/transactions/'+transactionId);
};
vm.loadTransactions();
}]);
})();
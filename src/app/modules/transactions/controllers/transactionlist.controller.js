(function(){
'use strict';
angular.module('app.transactions').controller('TransactionListController',['$scope','TransactionService','PaginationFactory',function($scope,TransactionService,PaginationFactory){
var vm=this;
vm.transactions=[];
vm.filterCriteria={cardId:'',startDate:'',endDate:'',transactionType:'',pageSize:50};
vm.pagination=null;
vm.loading=false;
vm.error=null;
var currentPage=1;
vm.loadTransactions=function(page){
vm.loading=true;
vm.error=null;
currentPage=page||1;
TransactionService.getTransactions(vm.filterCriteria,currentPage).then(function(data){
vm.transactions=data.transactions;
vm.pagination=PaginationFactory.create(data.total,vm.filterCriteria.pageSize);
vm.pagination.currentPage=currentPage;
vm.loading=false;
},function(error){
vm.error='Failed to load transactions';
vm.loading=false;
});
};
vm.applyFilters=function(){
vm.loadTransactions(1);
};
vm.goToPage=function(page){
vm.loadTransactions(page);
};
vm.init=function(){
vm.loadTransactions(1);
};
vm.init();
}]);
})();
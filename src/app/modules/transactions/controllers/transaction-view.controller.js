(function(){
'use strict';
angular.module('creditCard.transactions').controller('TransactionViewController',['TransactionService','SearchFilterService','DashboardKPIIntegrationService','$scope',function(TransactionService,SearchFilterService,DashboardKPIIntegrationService,$scope){
const vm=this;
vm.allTransactions=[];
vm.filteredTransactions=[];
vm.loading=true;
vm.error=null;
vm.filterCriteria={dateRange:{},amountRange:{},categories:[],cardIds:[],searchTerm:''};
vm.pagination={currentPage:1,itemsPerPage:10,totalItems:0};
vm.categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
vm.cards=[{id:'CC001',name:'Visa Platinum'},{id:'CC002',name:'MasterCard Gold'},{id:'CC003',name:'Amex Blue'}];
vm.loadTransactions=function(){
vm.loading=true;
TransactionService.getTransactions().then(function(transactions){
vm.allTransactions=transactions;
vm.applyFilters();
DashboardKPIIntegrationService.sendTransactionData(transactions);
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load transactions';
vm.loading=false;
});
};
vm.applyFilters=function(){
const startTime=Date.now();
vm.filteredTransactions=SearchFilterService.applyFilters(vm.allTransactions,vm.filterCriteria);
vm.pagination.totalItems=vm.filteredTransactions.length;
const elapsed=Date.now()-startTime;
if(elapsed>500)console.warn('Filter operation took '+elapsed+'ms');
};
vm.resetFilters=function(){
vm.filterCriteria={dateRange:{},amountRange:{},categories:[],cardIds:[],searchTerm:''};
vm.applyFilters();
};
vm.loadTransactions();
}]);
})();
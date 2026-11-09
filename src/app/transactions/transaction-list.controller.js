(function(){
'use strict';
angular.module('app.transactions').controller('TransactionListController',['$scope','TransactionService','SearchFactory',function($scope,TransactionService,SearchFactory){
const vm=this;
vm.loading=true;
vm.error=null;
vm.transactions=[];
vm.filters=SearchFactory.getFilterCriteria();
vm.loadTransactions=function(){
vm.loading=true;
vm.error=null;
TransactionService.getTransactions(vm.filters).then(function(data){
vm.transactions=data||TransactionService.getMockTransactions();
vm.loading=false;
},function(error){
vm.error='Failed to load transactions. Displaying sample data.';
vm.transactions=TransactionService.getMockTransactions();
vm.loading=false;
});
};
vm.applyFilters=function(newFilters){
SearchFactory.updateFilters(newFilters);
vm.filters=SearchFactory.getFilterCriteria();
vm.loadTransactions();
};
vm.resetFilters=function(){
SearchFactory.resetFilters();
vm.filters=SearchFactory.getFilterCriteria();
vm.loadTransactions();
};
vm.loadTransactions();
}]);
})();
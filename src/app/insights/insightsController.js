(function(){
'use strict';
angular.module('insightsModule').controller('insightsController',['transactionService','analyticsEngineService','$scope',function(transactionService,analyticsEngineService,$scope){
var vm=this;
vm.transactions=[];
vm.insightsData={};
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
vm.filteredTransactions=[];
vm.drillDownCategory=function(category){
vm.selectedCategory=category;
vm.filteredTransactions=vm.transactions.filter(function(t){return t.category===category;});
};
vm.clearDrillDown=function(){
vm.selectedCategory=null;
vm.filteredTransactions=[];
};
function init(){
transactionService.getTransactions().then(function(transactions){
vm.transactions=transactions;
vm.insightsData=analyticsEngineService.processTransactions(transactions);
vm.loading=false;
$scope.$broadcast('insights:dataUpdated',vm.insightsData);
},function(error){
vm.error='Failed to load insights data';
vm.loading=false;
});
}
init();
}]);
})();
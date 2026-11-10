(function(){
'use strict';
angular.module('spendingAnalyticsModule').controller('SpendingAnalyticsController',['TransactionDataService','AnalyticsEngineService','CategoryFactory','AuthService',function(TransactionDataService,AnalyticsEngineService,CategoryFactory,AuthService){
var vm=this;
vm.categorySpending=[];
vm.totalSpending=0;
vm.selectedCategory=null;
vm.filteredTransactions=[];
vm.loading=true;
vm.error=null;
vm.onCategorySelected=function(categoryName){
vm.selectedCategory=categoryName;
var catData=vm.categorySpending.find(function(c){
return c.categoryName===categoryName;
});
if(catData){
vm.filteredTransactions=catData.transactions;
}
};
vm.clearSelection=function(){
vm.selectedCategory=null;
vm.filteredTransactions=[];
};
vm.init=function(){
vm.loading=true;
var userId=AuthService.getUserId();
TransactionDataService.fetchCategorizedTransactions(userId).then(function(transactions){
vm.categorySpending=AnalyticsEngineService.aggregateByCategory(transactions);
vm.totalSpending=0;
angular.forEach(vm.categorySpending,function(cat){
vm.totalSpending+=cat.totalAmount;
});
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load spending analytics';
vm.loading=false;
});
};
vm.init();
}]);
})();
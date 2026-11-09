(function(){
'use strict';
angular.module('spendingAnalyticsModule').controller('AnalyticsController',['$scope','TransactionDataService','CategoryAggregator',function($scope,TransactionDataService,CategoryAggregator){
var vm=this;
vm.analyticsData={};
vm.selectedCategory=null;
vm.categoryTransactions=[];
vm.loading=true;
function loadAnalytics(){
vm.loading=true;
TransactionDataService.getCategoryTransactions().then(function(transactions){
vm.analyticsData=CategoryAggregator.aggregateByCategory(transactions);
vm.loading=false;
},function(error){
vm.loading=false;
console.error('Failed to load analytics:',error);
});
}
vm.onCategorySelect=function(category){
vm.selectedCategory=category;
TransactionDataService.getCategoryTransactions().then(function(transactions){
vm.categoryTransactions=transactions.filter(function(t){
return t.category===category;
});
});
};
loadAnalytics();
}]);
})();
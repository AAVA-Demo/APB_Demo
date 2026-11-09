(function(){
'use strict';
angular.module('creditCard.analytics').controller('AnalyticsController',['$scope','$filter','AnalyticsService',function($scope,$filter,AnalyticsService){
const vm=this;
vm.analytics={};
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
vm.filteredTransactions=[];
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingInsights(12).then(function(data){
vm.analytics=data;
vm.setupCharts();
vm.loading=false;
},function(err){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;
});
};
vm.setupCharts=function(){
const categoryData=vm.analytics.categorySpending;
vm.categoryLabels=Object.keys(categoryData);
vm.categoryValues=Object.values(categoryData);
vm.monthlyLabels=vm.analytics.monthlyTrend.map(function(m){return m.month;});
vm.monthlyValues=vm.analytics.monthlyTrend.map(function(m){return m.total;});
};
vm.onCategoryClick=function(points,evt){
if(points.length>0){
const index=points[0]._index;
vm.selectedCategory=vm.categoryLabels[index];
vm.filteredTransactions=$filter('categoryFilter')(vm.analytics.allTransactions,vm.selectedCategory);
$scope.$apply();
}
};
vm.clearFilter=function(){
vm.selectedCategory=null;
vm.filteredTransactions=[];
};
vm.loadAnalytics();
}]);
})();
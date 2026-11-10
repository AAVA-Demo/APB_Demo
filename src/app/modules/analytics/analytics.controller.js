(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['DataAggregationService','$scope',function(DataAggregationService,$scope){
const vm=this;
vm.spendingSummary=null;
vm.loading=true;
vm.selectedCategory=null;
vm.chartData=null;
vm.trendChartData=null;
vm.init=function(){
vm.loading=true;
DataAggregationService.getSpendingSummary('12months').then(function(summary){
vm.spendingSummary=summary;
vm.prepareChartData();
vm.prepareTrendChartData();
vm.loading=false;
}).catch(function(err){
vm.loading=false;
vm.error='Failed to load analytics data';
});
};
vm.prepareChartData=function(){
const labels=[];
const data=[];
const colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
vm.spendingSummary.categoryBreakdown.forEach(function(cat){
labels.push(cat.category);
data.push(cat.totalAmount);
});
vm.chartData={
labels:labels,
datasets:[{
data:data,
backgroundColor:colors.slice(0,labels.length)
}]
};
};
vm.prepareTrendChartData=function(){
const labels=[];
const data=[];
vm.spendingSummary.monthlyTrends.forEach(function(trend){
labels.push(trend.month);
data.push(trend.totalSpend);
});
vm.trendChartData={
labels:labels,
datasets:[{
label:'Monthly Spend',
data:data,
borderColor:'#36A2EB',
backgroundColor:'rgba(54,162,235,0.2)',
fill:true
}]
};
};
vm.onCategoryClick=function(category){
vm.selectedCategory=category;
DataAggregationService.getFilteredData(category).then(function(filteredTrends){
const labels=[];
const data=[];
filteredTrends.forEach(function(trend){
labels.push(trend.month);
data.push(trend.totalSpend);
});
vm.trendChartData={
labels:labels,
datasets:[{
label:category+' Spend',
data:data,
borderColor:'#FF6384',
backgroundColor:'rgba(255,99,132,0.2)',
fill:true
}]
};
$scope.$broadcast('updateTrendChart');
});
};
vm.resetFilter=function(){
vm.selectedCategory=null;
vm.prepareTrendChartData();
$scope.$broadcast('updateTrendChart');
};
vm.formatCurrency=function(amount){
return '₹'+amount.toLocaleString('en-IN');
};
vm.init();
}]);
})();
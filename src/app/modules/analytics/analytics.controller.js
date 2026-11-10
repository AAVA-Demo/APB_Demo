(function(){
'use strict';
angular.module('app.analytics')
.controller('AnalyticsController',['$scope','$filter','AnalyticsEngineService',function($scope,$filter,AnalyticsEngineService){
var vm=this;
vm.spendingData=null;
vm.loading=true;
vm.error=null;
vm.selectedTimeRange=12;
vm.chartData=null;
vm.categoryChartData=null;
function init(){
loadAnalytics(vm.selectedTimeRange);
}
function loadAnalytics(months){
vm.loading=true;
vm.error=null;
AnalyticsEngineService.getSpendingAnalytics(months)
.then(function(data){
vm.spendingData=data;
prepareChartData();
vm.loading=false;
})
.catch(function(err){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
function prepareChartData(){
if(!vm.spendingData)return;
vm.chartData={
labels:vm.spendingData.monthlyTrends.map(function(t){return t.month;}),
datasets:[{
label:'Monthly Spend',
data:vm.spendingData.monthlyTrends.map(function(t){return t.total;}),
backgroundColor:'rgba(54,162,235,0.2)',
borderColor:'rgba(54,162,235,1)',
borderWidth:2,
fill:true
}]
};
var categories=Object.keys(vm.spendingData.categoryBreakdown);
var values=categories.map(function(c){return vm.spendingData.categoryBreakdown[c];});
vm.categoryChartData={
labels:categories,
datasets:[{
label:'Category Spending',
data:values,
backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'],
borderWidth:1
}]
};
}
vm.changeTimeRange=function(months){
vm.selectedTimeRange=months;
loadAnalytics(months);
};
vm.getCategoryTotal=function(){
if(!vm.spendingData)return 0;
var total=0;
for(var cat in vm.spendingData.categoryBreakdown){
total+=vm.spendingData.categoryBreakdown[cat];
}
return total.toFixed(2);
};
init();
}]);
})();
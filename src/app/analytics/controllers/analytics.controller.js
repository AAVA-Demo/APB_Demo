(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['$scope','AnalyticsEngineService',function($scope,AnalyticsEngineService){
var vm=this;
vm.analytics=null;
vm.monthlyChartData=null;
vm.categoryChartData=null;
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
function init(){
loadAnalytics();
}
function loadAnalytics(categoryFilter){
vm.loading=true;
vm.error=null;
AnalyticsEngineService.getSpendingAnalytics('12months',categoryFilter).then(function(analytics){
vm.analytics=analytics;
buildChartData();
vm.loading=false;
},function(error){
vm.error='Failed to load analytics data.';
vm.loading=false;
if(!categoryFilter){
retryLoad();
}
});
}
function buildChartData(){
var monthLabels=vm.analytics.monthlyTrends.map(function(item){return item.month;});
var monthValues=vm.analytics.monthlyTrends.map(function(item){return item.amount;});
vm.monthlyChartData={
labels:monthLabels,
datasets:[{label:'Monthly Spend',data:monthValues,borderColor:'#3498db',backgroundColor:'rgba(52,152,219,0.2)',fill:true}]
};
var categoryLabels=vm.analytics.categoryBreakdown.map(function(item){return item.category;});
var categoryValues=vm.analytics.categoryBreakdown.map(function(item){return item.amount;});
vm.categoryChartData={
labels:categoryLabels,
datasets:[{label:'Category Spend',data:categoryValues,backgroundColor:['#e74c3c','#f39c12','#9b59b6','#3498db','#1abc9c','#34495e','#e67e22','#95a5a6','#7f8c8d']}]
};
}
vm.drillDownCategory=function(category){
vm.selectedCategory=category;
loadAnalytics(category);
};
vm.resetDrillDown=function(){
vm.selectedCategory=null;
loadAnalytics();
};
function retryLoad(){
setTimeout(function(){
loadAnalytics();
},3000);
}
init();
}]);
})();
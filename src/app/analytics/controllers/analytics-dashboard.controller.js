(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsDashboardController',['AnalyticsService','$scope','$timeout',function(AnalyticsService,$scope,$timeout){
var vm=this;
vm.analytics={};
vm.categoryChartData=[];
vm.categoryLabels=[];
vm.trendChartData=[];
vm.trendLabels=[];
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
function loadAnalytics(filterCategory){
vm.loading=true;
var timeRange={startDate:new Date(new Date().setFullYear(new Date().getFullYear()-1)),endDate:new Date()};
AnalyticsService.getSpendingAnalytics(timeRange,filterCategory).then(function(data){
vm.analytics=data;
vm.categoryLabels=Object.keys(data.categorySpending);
vm.categoryChartData=Object.values(data.categorySpending);
vm.trendLabels=data.monthlyTrends.map(function(t){return t.month;});
vm.trendChartData=data.monthlyTrends.map(function(t){return t.totalSpend;});
vm.loading=false;
},function(err){
vm.error='Failed to load analytics';
vm.loading=false;
});
}
vm.handleDrillDown=function(category){
vm.selectedCategory=category;
loadAnalytics(category);
};
vm.resetFilter=function(){
vm.selectedCategory=null;
loadAnalytics(null);
};
loadAnalytics(null);
}]);
})();
(function(){
'use strict';
angular.module('creditCard.analytics').controller('AnalyticsController',['$scope','$timeout','AnalyticsService','ChartService',function($scope,$timeout,AnalyticsService,ChartService){
const vm=this;
vm.analyticsData=null;
vm.loading=false;
vm.error=null;
vm.userId='user123';
vm.categoryChart=null;
vm.trendChart=null;
const now=new Date();
const twelveMonthsAgo=new Date(now.getFullYear()-1,now.getMonth(),1);
vm.dateRange={startDate:twelveMonthsAgo.toISOString().split('T')[0],endDate:now.toISOString().split('T')[0]};
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingAnalytics(vm.userId,vm.dateRange).then(function(data){
vm.analyticsData=data;
vm.loading=false;
$timeout(function(){
if(vm.categoryChart)ChartService.destroyChart(vm.categoryChart);
if(vm.trendChart)ChartService.destroyChart(vm.trendChart);
if(vm.analyticsData.categorySpending.length>0){
vm.categoryChart=ChartService.renderCategoryChart('categoryChart',vm.analyticsData.categorySpending);
}
if(vm.analyticsData.monthlyTrends.length>0){
vm.trendChart=ChartService.renderTrendChart('trendChart',vm.analyticsData.monthlyTrends);
}
},100);
},function(error){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;
});
};
vm.updateDateRange=function(){
vm.loadAnalytics();
};
vm.loadAnalytics();
$scope.$on('$destroy',function(){
if(vm.categoryChart)ChartService.destroyChart(vm.categoryChart);
if(vm.trendChart)ChartService.destroyChart(vm.trendChart);
});
}]);
})();
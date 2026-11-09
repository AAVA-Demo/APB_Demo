(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',['$scope','AnalyticsService','ChartFactory',function($scope,AnalyticsService,ChartFactory){
var vm=this;
vm.analyticsData={};
vm.monthlyChart=null;
vm.cardChart=null;
vm.categoryChart=null;
vm.loading=true;
vm.error=null;
function init(){
loadAnalytics();
}
function loadAnalytics(){
vm.loading=true;
AnalyticsService.getAnalyticsData().then(function(data){
vm.analyticsData=data;
vm.loading=false;
renderCharts();
},function(err){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
function renderCharts(){
vm.monthlyChart=ChartFactory.createLineChart(vm.analyticsData.monthlyTrends);
vm.cardChart=ChartFactory.createBarChart(vm.analyticsData.cardWiseSpend);
vm.categoryChart=ChartFactory.createPieChart(vm.analyticsData.categoryWiseSpend);
}
init();
}]);
})();
(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',AnalyticsController);
AnalyticsController.$inject=['AnalyticsService','$scope','$filter'];
function AnalyticsController(AnalyticsService,$scope,$filter){
var vm=this;
vm.insights=null;
vm.loading=true;
vm.error=null;
vm.categoryChartData=null;
vm.monthlyChartData=null;
vm.dateRange={months:12};
vm.selectedCard=null;
vm.refreshInsights=refreshInsights;
function init(){
refreshInsights();
}
function refreshInsights(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingInsights(vm.dateRange.months,vm.selectedCard).then(function(data){
vm.insights=data;
vm.categoryChartData=prepareCategoryChartData(data.categorySpends);
vm.monthlyChartData=prepareMonthlyChartData(data.monthlyTrends);
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;
});
}
function prepareCategoryChartData(categorySpends){
return{labels:categorySpends.map(function(c){return c.category;}),data:categorySpends.map(function(c){return c.totalAmount;}),type:'pie'};
}
function prepareMonthlyChartData(monthlyTrends){
return{labels:monthlyTrends.map(function(m){return m.month;}),data:monthlyTrends.map(function(m){return m.totalSpend;}),type:'line'};
}
init();
}
})();
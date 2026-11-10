(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['AnalyticsService','$scope','$filter',function(AnalyticsService,$scope,$filter){
var vm=this;
vm.insights={};
vm.loading=true;
vm.error=null;
vm.dateRange={start:new Date(new Date().setMonth(new Date().getMonth()-12)),end:new Date()};
function loadInsights(){
vm.loading=true;
var startDate=$filter('date')(vm.dateRange.start,'yyyy-MM-dd');
var endDate=$filter('date')(vm.dateRange.end,'yyyy-MM-dd');
AnalyticsService.getSpendingInsights(startDate,endDate).then(function(insights){
vm.insights=insights;
vm.loading=false;},function(error){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;});}
loadInsights();
vm.applyDateFilter=function(){
loadInsights();};
}]);
})();
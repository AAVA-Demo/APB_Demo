(function(){
'use strict';
angular.module('app.creditCard.analytics').controller('AnalyticsController',AnalyticsController);
AnalyticsController.$inject=['AnalyticsService','$scope','$filter'];
function AnalyticsController(AnalyticsService,$scope,$filter){
var vm=this;
vm.analyticsData=null;
vm.loading=true;
vm.error=null;
vm.selectedCategories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
vm.dateRange={startDate:getDefaultStartDate(),endDate:getDefaultEndDate()};
vm.applyFilters=applyFilters;
var userId='user123';
init();
function init(){
loadAnalytics();}
function loadAnalytics(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingAnalytics(userId,vm.dateRange.startDate,vm.dateRange.endDate,vm.selectedCategories).then(function(data){
vm.analyticsData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load analytics data';
vm.loading=false;
});}
function applyFilters(){
loadAnalytics();}
function getDefaultStartDate(){
var date=new Date();
date.setMonth(date.getMonth()-12);
return date.toISOString().substring(0,10);}
function getDefaultEndDate(){
return new Date().toISOString().substring(0,10);}
}
})();
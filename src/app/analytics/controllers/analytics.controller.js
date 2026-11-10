(function(){
'use strict';
angular.module('spendingAnalytics').controller('AnalyticsController',AnalyticsController);
AnalyticsController.$inject=['AnalyticsService','$scope','$filter'];
function AnalyticsController(AnalyticsService,$scope,$filter){
var vm=this;
vm.analyticsData={};
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
vm.selectedCard=null;
vm.filteredData={};
vm.applyFilter=applyFilter;
activate();
function activate(){
loadAnalytics();
}
function loadAnalytics(){
vm.loading=true;
AnalyticsService.getSpendingAnalytics({}).then(function(data){
vm.analyticsData=data;
vm.filteredData=angular.copy(data);
vm.loading=false;
},function(err){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
function applyFilter(){
var filtered=angular.copy(vm.analyticsData);
if(vm.selectedCategory){
filtered.categoryBreakdown=filtered.categoryBreakdown.filter(function(cat){
return cat.category===vm.selectedCategory;
});
}
if(vm.selectedCard){
filtered.cardWiseSpending=filtered.cardWiseSpending.filter(function(card){
return card.cardId===vm.selectedCard;
});
}
vm.filteredData=filtered;
}
}
})();
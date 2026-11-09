(function(){
'use strict';
angular.module('creditCardApp.transactionAnalytics').controller('TransactionAnalyticsController',['AnalyticsEngine','DataVisualizationService','AuthService','$scope','$timeout',function(AnalyticsEngine,DataVisualizationService,AuthService,$scope,$timeout){
var vm=this;
vm.categoryInsights=[];
vm.monthlyTrends=[];
vm.loading=true;
vm.dateRange={months:12};
vm.init=init;
function init(){
var userId=AuthService.getUserId();
loadAnalytics(userId);
}
function loadAnalytics(userId){
vm.loading=true;
AnalyticsEngine.getInsights(userId,vm.dateRange).then(function(data){
vm.categoryInsights=data.categoryInsights;
vm.monthlyTrends=data.monthlyTrends;
vm.loading=false;
$timeout(function(){
DataVisualizationService.renderCategoryChart('categoryChart',vm.categoryInsights);
DataVisualizationService.renderTrendChart('trendChart',vm.monthlyTrends);
},100);
},function(error){
toastr.error('Failed to load analytics');
vm.loading=false;
});
}
vm.init();
}]);
})();
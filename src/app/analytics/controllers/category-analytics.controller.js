(function(){
'use strict';
angular.module('analyticsModule').controller('CategoryAnalyticsController',['$scope','AnalyticsService','VisualizationService','AuthService',function($scope,AnalyticsService,VisualizationService,AuthService){
var vm=this;
vm.categoryData=[];
vm.loading=true;
vm.error=null;
var chart=null;
function init(){
var userId=AuthService.getUserId();
if(!userId){
vm.error='User not authenticated';
vm.loading=false;
return;
}
AnalyticsService.getCategorySpend(userId,12).then(function(data){
vm.categoryData=data;
renderChart(data);
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load category analytics';
vm.loading=false;
});
}
function renderChart(data){
var labels=data.map(function(item){return item.category;});
var amounts=data.map(function(item){return item.amount;});
var chartData={labels:labels,datasets:[{label:'Spending by Category',data:amounts,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]};
chart=VisualizationService.renderChart('categoryChart','pie',chartData,{});
}
$scope.$on('$destroy',function(){
if(chart)VisualizationService.destroyChart(chart);
});
init();
}]);
})();
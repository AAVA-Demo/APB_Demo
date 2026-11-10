(function(){
'use strict';
angular.module('analyticsModule').controller('TrendAnalyticsController',['$scope','AnalyticsService','VisualizationService','AuthService',function($scope,AnalyticsService,VisualizationService,AuthService){
var vm=this;
vm.trendData=[];
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
AnalyticsService.getMonthlyTrend(userId,12).then(function(data){
vm.trendData=data;
renderChart(data);
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load trend analytics';
vm.loading=false;
});
}
function renderChart(data){
var labels=data.map(function(item){return item.month;});
var amounts=data.map(function(item){return item.totalSpend;});
var chartData={labels:labels,datasets:[{label:'Monthly Spend Trend',data:amounts,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]};
chart=VisualizationService.renderChart('trendChart','line',chartData,{});
}
$scope.$on('$destroy',function(){
if(chart)VisualizationService.destroyChart(chart);
});
init();
}]);
})();
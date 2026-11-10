(function(){
'use strict';
angular.module('analyticsModule').directive('trendChart',['VisualizationService',function(VisualizationService){
return{
restrict:'E',scope:{data:'='},template:'<div class="chart-container"><canvas id="trendChart" width="600" height="300"></canvas></div>',link:function(scope,element){
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
if(chart)VisualizationService.destroyChart(chart);
var labels=newData.map(function(item){return item.month;});
var amounts=newData.map(function(item){return item.totalSpend;});
var chartData={labels:labels,datasets:[{label:'Monthly Spend Trend',data:amounts,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]};
chart=VisualizationService.renderChart('trendChart','line',chartData,{});
}
});
scope.$on('$destroy',function(){
if(chart)VisualizationService.destroyChart(chart);
});
}
};
}]);
})();
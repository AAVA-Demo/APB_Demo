(function(){
'use strict';
angular.module('analyticsModule').directive('categoryChart',['VisualizationService',function(VisualizationService){
return{
restrict:'E',scope:{data:'='},template:'<div class="chart-container"><canvas id="categoryChart" width="400" height="400"></canvas></div>',link:function(scope,element){
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
if(chart)VisualizationService.destroyChart(chart);
var labels=newData.map(function(item){return item.category;});
var amounts=newData.map(function(item){return item.amount;});
var chartData={labels:labels,datasets:[{label:'Spending by Category',data:amounts,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]};
chart=VisualizationService.renderChart('categoryChart','pie',chartData,{});
}
});
scope.$on('$destroy',function(){
if(chart)VisualizationService.destroyChart(chart);
});
}
};
}]);
})();
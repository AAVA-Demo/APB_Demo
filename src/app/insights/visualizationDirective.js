(function(){
'use strict';
angular.module('insightsModule').directive('visualization',[function(){
return{
restrict:'E',
scope:{chartType:'@',insightsData:'=',onDrillDown:'&'},
template:'<div class="chart-container"><canvas id="{{canvasId}}"></canvas></div>',
link:function(scope,element){
scope.canvasId='viz-'+Math.random().toString(36).substr(2,9);
var chart=null;
function renderChart(){
if(!scope.insightsData)return;
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
if(chart){
chart.destroy();
}
if(scope.chartType==='monthlyTrend'){
var labels=scope.insightsData.monthlyTrends.map(function(item){return item.month;});
var data=scope.insightsData.monthlyTrends.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'rgb(75,192,192)',tension:0.1}]},options:{responsive:true,maintainAspectRatio:false,onClick:function(evt,item){if(item.length>0){var index=item[0]._index;var month=labels[index];if(scope.onDrillDown){scope.onDrillDown({month:month});}}}});
}else if(scope.chartType==='category'){
var labels=scope.insightsData.categoryBreakdown.map(function(item){return item.category;});
var data=scope.insightsData.categoryBreakdown.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false,onClick:function(evt,item){if(item.length>0){var index=item[0]._index;var category=labels[index];if(scope.onDrillDown){scope.$apply(function(){scope.onDrillDown({category:category});});}}}}});
}
}
scope.$on('insights:dataUpdated',function(){
renderChart();
});
scope.$watch('insightsData',function(newVal){
if(newVal){
renderChart();
}
});
}
};
}]);
})();
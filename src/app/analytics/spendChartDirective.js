(function(){
'use strict';
angular.module('analyticsModule').directive('spendChart',[function(){
return{
restrict:'E',
scope:{chartType:'@',chartData:'='},
template:'<div class="chart-container"><canvas id="{{canvasId}}"></canvas></div>',
link:function(scope,element){
scope.canvasId='chart-'+Math.random().toString(36).substr(2,9);
var chart=null;
function renderChart(){
if(!scope.chartData)return;
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
if(chart){
chart.destroy();
}
if(scope.chartType==='monthlyTrend'){
var labels=scope.chartData.monthlyTrends.map(function(item){return item.month;});
var data=scope.chartData.monthlyTrends.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'rgb(75,192,192)',tension:0.1}]},options:{responsive:true,maintainAspectRatio:false}});
}else if(scope.chartType==='cardWise'){
var labels=scope.chartData.cardWiseSpend.map(function(item){return item.cardId;});
var data=scope.chartData.cardWiseSpend.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'bar',data:{labels:labels,datasets:[{label:'Card-wise Spend',data:data,backgroundColor:'rgb(54,162,235)'}]},options:{responsive:true,maintainAspectRatio:false}});
}else if(scope.chartType==='category'){
var labels=scope.chartData.categoryWiseSpend.map(function(item){return item.category;});
var data=scope.chartData.categoryWiseSpend.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false}});
}
}
scope.$on('analytics:dataUpdated',function(){
renderChart();
});
scope.$watch('chartData',function(newVal){
if(newVal){
renderChart();
}
});
}
};
}]);
})();
(function(){
'use strict';
angular.module('app.analytics').directive('spendingChart',['AnalyticsService','$timeout',function(AnalyticsService,$timeout){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@'},
template:'<div class="chart-container"><canvas id="{{canvasId}}"></canvas></div>',
link:function(scope,element,attrs){
scope.canvasId='chart-'+Math.random().toString(36).substr(2,9);
var chart=null;
function renderChart(){
if(!scope.chartData)return;
$timeout(function(){
var canvas=document.getElementById(scope.canvasId);
if(!canvas)return;
var ctx=canvas.getContext('2d');
if(chart){
chart.destroy();
}
if(scope.chartType==='pie'){
var labels=scope.chartData.categoryBreakdown.map(function(item){return item.category;});
var data=scope.chartData.categoryBreakdown.map(function(item){return item.amount;});
chart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false}});
}else if(scope.chartType==='line'){
var labels=scope.chartData.monthlyTrends.map(function(item){return item.month;});
var data=scope.chartData.monthlyTrends.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'#36A2EB',fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}else if(scope.chartType==='bar'){
var labels=scope.chartData.cardWiseSpend.map(function(item){return item.cardName;});
var data=scope.chartData.cardWiseSpend.map(function(item){return item.totalSpend;});
chart=new Chart(ctx,{type:'bar',data:{labels:labels,datasets:[{label:'Card-wise Spend',data:data,backgroundColor:'#4BC0C0'}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
},100);
}
scope.$watch('chartData',function(newVal){
if(newVal){
renderChart();
}
},true);
scope.$on('analyticsDataLoaded',function(event,data){
scope.chartData=data;
renderChart();
});
scope.$on('filterByCard',function(event,cardId){
if(cardId&&scope.chartData){
renderChart();
}
});
scope.$on('$destroy',function(){
if(chart){
chart.destroy();
}
});
}
};
}]);
})();
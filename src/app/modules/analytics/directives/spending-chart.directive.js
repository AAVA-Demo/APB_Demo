(function(){
'use strict';
angular.module('creditCard.analytics').directive('spendingChart',['$timeout','CategoryFactory',function($timeout,CategoryFactory){
return{
restrict:'E',scope:{data:'=',chartType:'@',title:'@'},template:'<div class="chart-container"><h4>{{title}}</h4><canvas id="{{canvasId}}" width="400" height="200"></canvas></div>',link:function(scope,element){
scope.canvasId='chart_'+Math.random().toString(36).substr(2,9);
var chart=null;
scope.$watch('data',function(newData){
if(!newData||newData.length===0)return;
$timeout(function(){
var canvas=document.getElementById(scope.canvasId);
if(!canvas)return;
var ctx=canvas.getContext('2d');
if(chart){
chart.destroy();
}
var chartConfig={};
if(scope.chartType==='category'){
var labels=newData.map(function(d){return d.category;});
var values=newData.map(function(d){return d.amount;});
var colors=newData.map(function(d){return CategoryFactory.getCategoryColor(d.category);});
chartConfig={type:'pie',data:{labels:labels,datasets:[{data:values,backgroundColor:colors}]},options:{responsive:true,maintainAspectRatio:false,legend:{position:'bottom'}}};
}else if(scope.chartType==='monthly'){
var labels=newData.map(function(d){return d.month;});
var values=newData.map(function(d){return d.totalSpend;});
chartConfig={type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:values,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}else if(scope.chartType==='cardwise'){
var labels=newData.map(function(d){return d.cardName;});
var values=newData.map(function(d){return d.totalSpend;});
chartConfig={type:'bar',data:{labels:labels,datasets:[{label:'Card-wise Spend',data:values,backgroundColor:'#4BC0C0'}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}
chart=new Chart(ctx,chartConfig);
},100);
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
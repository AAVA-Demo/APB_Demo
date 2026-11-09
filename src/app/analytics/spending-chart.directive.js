(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',[function(){
return{restrict:'E',scope:{data:'=',chartType:'@'},template:'<canvas id="{{canvasId}}" width="400" height="300"></canvas>',link:function(scope,element,attrs){
scope.canvasId='chart-'+Math.random().toString(36).substr(2,9);
var chart=null;
scope.$watch('data',function(newData){
if(!newData||newData.length===0)return;
var ctx=document.getElementById(scope.canvasId);
if(!ctx){
setTimeout(function(){
scope.$watch('data',arguments.callee);
},100);
return;
}
if(chart){
chart.destroy();
}
var chartConfig={type:scope.chartType||'pie',data:{labels:[],datasets:[{data:[],backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:true,legend:{position:'bottom'}}};
if(scope.chartType==='pie'){
chartConfig.data.labels=newData.map(function(item){return item.category;});
chartConfig.data.datasets[0].data=newData.map(function(item){return item.totalAmount;});
}else if(scope.chartType==='line'){
chartConfig.type='line';
chartConfig.data.labels=newData.map(function(item){return item.month;});
chartConfig.data.datasets[0]={label:'Monthly Spend',data:newData.map(function(item){return item.totalSpend;}),borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true};
}
chart=new Chart(ctx,chartConfig);
},true);
}};
}]);
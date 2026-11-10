(function(){
'use strict';
angular.module('creditCard.analytics').directive('spendingChart',['$timeout',function($timeout){
return{
restrict:'E',scope:{chartData:'=',chartType:'='},template:'<canvas id="{{chartId}}" width="400" height="300"></canvas>',link:function(scope,element){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
var chartInstance=null;
scope.$watch('chartData',function(newData){
if(!newData||newData.length===0){return;}
$timeout(function(){
var ctx=document.getElementById(scope.chartId);
if(!ctx){return;}
if(chartInstance){chartInstance.destroy();}
var labels,data,backgroundColor;
if(scope.chartType==='pie'){
labels=newData.map(function(item){return item.category;});
data=newData.map(function(item){return item.totalAmount;});
backgroundColor=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
chartInstance=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:data,backgroundColor:backgroundColor}]},options:{responsive:true,maintainAspectRatio:false}});
}else if(scope.chartType==='line'){
labels=newData.map(function(item){return item.month;});
data=newData.map(function(item){return item.totalSpend;});
chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
},100);
});
scope.$on('$destroy',function(){
if(chartInstance){chartInstance.destroy();}
});
}
};
}]);
})();
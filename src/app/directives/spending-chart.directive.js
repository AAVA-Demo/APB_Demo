(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',['$timeout',function($timeout){
return {restrict:'E',scope:{chartType:'=',chartData:'=',chartTitle:'='},template:'<div class="spending-chart"><h3>{{chartTitle}}</h3><canvas id="{{chartId}}" width="400" height="200"></canvas></div>',link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
let chartInstance=null;
scope.$watch('chartData',function(newData){
if(newData&&newData.length>0){
$timeout(function(){
const ctx=document.getElementById(scope.chartId);
if(ctx){
if(chartInstance){
chartInstance.destroy();
}
const chartConfig=scope.buildChartConfig(newData,scope.chartType);
chartInstance=new Chart(ctx,chartConfig);
}
},100);
}
},true);
scope.buildChartConfig=function(data,type){
if(type==='pie'){
const labels=data.map(function(d){return d.category;});
const values=data.map(function(d){return d.amount;});
return {type:'pie',data:{labels:labels,datasets:[{data:values,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#C9CBCF','#8BC34A','#E91E63']}]},options:{responsive:true,maintainAspectRatio:false}};
}else if(type==='line'){
const labels=data.map(function(d){return d.month;});
const values=data.map(function(d){return d.totalSpend;});
return {type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:values,borderColor:'#36A2EB',fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}else if(type==='bar'){
const labels=data.map(function(d){return d.cardName;});
const values=data.map(function(d){return d.totalSpend;});
return {type:'bar',data:{labels:labels,datasets:[{label:'Card-Wise Spend',data:values,backgroundColor:'#4BC0C0'}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}
};
scope.$on('$destroy',function(){
if(chartInstance){
chartInstance.destroy();
}
});
}};
}]);
})();
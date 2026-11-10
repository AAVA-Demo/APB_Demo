(function(){
'use strict';
angular.module('spendingAnalytics').directive('spendingChart',spendingChart);
spendingChart.$inject=[];
function spendingChart(){
return{restrict:'E',scope:{data:'=',chartType:'@'},template:'<canvas id="{{chartId}}"></canvas>',link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
scope.$watch('data',function(newVal){
if(newVal){
renderChart();
}
},true);
function renderChart(){
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
if(scope.chartInstance){
scope.chartInstance.destroy();
}
var chartConfig={};
if(scope.chartType==='category'){
chartConfig={type:'pie',data:{labels:scope.data.map(function(d){return d.category;}),datasets:[{data:scope.data.map(function(d){return d.totalAmount;}),backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false}};
}else if(scope.chartType==='card'){
chartConfig={type:'bar',data:{labels:scope.data.map(function(d){return d.cardId;}),datasets:[{label:'Spending by Card',data:scope.data.map(function(d){return d.amount;}),backgroundColor:'#36A2EB'}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}else if(scope.chartType==='timeseries'){
chartConfig={type:'line',data:{labels:scope.data.map(function(d){return d.month;}),datasets:[{label:'Monthly Spending',data:scope.data.map(function(d){return d.amount;}),borderColor:'#FF6384',fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}
scope.chartInstance=new Chart(ctx,chartConfig);
}
}};
}
})();
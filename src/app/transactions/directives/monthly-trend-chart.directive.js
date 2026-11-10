(function(){
'use strict';
angular.module('transactionManagement').directive('monthlyTrendChart',monthlyTrendChart);
monthlyTrendChart.$inject=[];
function monthlyTrendChart(){
return{restrict:'E',scope:{trends:'='},template:'<canvas id="{{chartId}}"></canvas>',link:function(scope,element,attrs){
scope.chartId='trend-chart-'+Math.random().toString(36).substr(2,9);
scope.$watch('trends',function(newVal){
if(newVal&&newVal.length>0){
renderChart();
}
},true);
function renderChart(){
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
if(scope.chartInstance){
scope.chartInstance.destroy();
}
var chartConfig={type:'line',data:{labels:scope.trends.map(function(t){return t.month;}),datasets:[{label:'Monthly Spending Trend',data:scope.trends.map(function(t){return t.totalSpend;}),borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
scope.chartInstance=new Chart(ctx,chartConfig);
}
}};
}
})();
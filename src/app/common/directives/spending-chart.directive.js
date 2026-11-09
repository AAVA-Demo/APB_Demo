(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',spendingChart);
function spendingChart(){
return{restrict:'E',scope:{chartData:'=',chartType:'@'},template:'<canvas id="{{chartId}}" width="400" height="200"></canvas>',link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
var ctx=null;
var chartInstance=null;
scope.$watch('chartData',function(newData){
if(newData&&newData.labels&&newData.data){
renderChart(newData);
}
});
function renderChart(data){
if(!ctx){
var canvas=element.find('canvas')[0];
if(canvas){
ctx=canvas.getContext('2d');
}
}
if(chartInstance){
chartInstance.destroy();
}
var chartType=scope.chartType||data.type||'bar';
var chartConfig={type:chartType,data:{labels:data.labels,datasets:[{label:data.label||'Spending',data:data.data,backgroundColor:generateColors(data.data.length),borderColor:'rgba(75,192,192,1)',borderWidth:1}]},options:{responsive:true,maintainAspectRatio:true,legend:{display:true,position:'bottom'},animation:{duration:800}}};
if(ctx){
chartInstance=new Chart(ctx,chartConfig);
}
}
function generateColors(count){
var colors=['rgba(255,99,132,0.6)','rgba(54,162,235,0.6)','rgba(255,206,86,0.6)','rgba(75,192,192,0.6)','rgba(153,102,255,0.6)','rgba(255,159,64,0.6)','rgba(199,199,199,0.6)','rgba(83,102,255,0.6)','rgba(255,99,255,0.6)'];
var result=[];
for(var i=0;i<count;i++){
result.push(colors[i%colors.length]);
}
return result;
}
scope.$on('$destroy',function(){
if(chartInstance){
chartInstance.destroy();
}
});
}};
}
})();
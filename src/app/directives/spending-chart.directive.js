(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',['$timeout',function($timeout){
return{
restrict:'E',
scope:{
chartData:'=',
chartType:'@',
onClick:'='
},
template:'<canvas id="{{chartId}}" width="400" height="300"></canvas>',
link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
let chartInstance=null;
const renderChart=function(){
if(!scope.chartData)return;
$timeout(function(){
const canvas=document.getElementById(scope.chartId);
if(!canvas)return;
const ctx=canvas.getContext('2d');
if(chartInstance){
chartInstance.destroy();
}
const config={
type:scope.chartType||'pie',
data:scope.chartData,
options:{
responsive:true,
maintainAspectRatio:true,
onClick:function(evt,activeElements){
if(scope.onClick&&activeElements.length>0){
const index=activeElements[0]._index;
const label=scope.chartData.labels[index];
scope.$apply(function(){
scope.onClick(label);
});
}
}
}
};
if(scope.chartType==='line'){
config.options.scales={yAxes:[{ticks:{beginAtZero:true}}]};
}
chartInstance=new Chart(ctx,config);
},100);
};
scope.$watch('chartData',function(newVal){
if(newVal){
renderChart();
}
},true);
scope.$on('updateTrendChart',function(){
renderChart();
});
scope.$on('$destroy',function(){
if(chartInstance){
chartInstance.destroy();
}
});
}
};
}]);
})();
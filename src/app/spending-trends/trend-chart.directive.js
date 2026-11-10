(function(){
'use strict';
angular.module('creditCardApp')
.directive('trendChart',[function(){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@'},
template:'<canvas></canvas>',
link:function(scope,element){
var canvas=element.find('canvas')[0];
var chart=null;
function renderChart(){
if(chart){
chart.destroy();
}
if(!scope.chartData||!scope.chartData.length){
return;
}
var ctx=canvas.getContext('2d');
var labels,data,label;
if(scope.chartType==='line'){
labels=scope.chartData.map(function(d){return d.month;});
data=scope.chartData.map(function(d){return d.totalSpend;});
label='Monthly Spend';
}else if(scope.chartType==='bar'){
labels=scope.chartData.map(function(d){return d.cardName;});
data=scope.chartData.map(function(d){return d.totalSpend;});
label='Card Spend';
}
chart=new Chart(ctx,{
type:scope.chartType==='line'?'line':'bar',
data:{
labels:labels,
datasets:[{
label:label,
data:data,
backgroundColor:scope.chartType==='line'?'rgba(75,192,192,0.2)':'rgba(54,162,235,0.6)',
borkerColor:scope.chartType==='line'?'rgba(75,192,192,1)':'rgba(54,162,235,1)',
borderWidth:2
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{
y:{beginAtZero:true}
}
}
});
}
scope.$watch('chartData',renderChart,true);
scope.$on('$destroy',function(){
if(chart){
chart.destroy();
}
});
}
};
}]);
})();
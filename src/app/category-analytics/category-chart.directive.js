(function(){
'use strict';
angular.module('creditCardApp')
.directive('categoryChart',[function(){
return{
restrict:'E',
scope:{chartData:'='},
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
var labels=scope.chartData.map(function(d){return d.name;});
var data=scope.chartData.map(function(d){return d.amount;});
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
chart=new Chart(ctx,{
type:'pie',
data:{
labels:labels,
datasets:[{
data:data,
backgroundColor:colors
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{position:'bottom'},
tooltip:{callbacks:{label:function(context){
var label=context.label||'';
var value=context.parsed||0;
var total=context.dataset.data.reduce(function(a,b){return a+b;},0);
var percentage=total>0?((value/total)*100).toFixed(2):0;
return label+': ₹'+value.toFixed(2)+' ('+percentage+'%)';
}}}
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
(function(){
'use strict';
angular.module('creditCardApp')
.directive('spendingChart',[function(){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@'},
template:'<canvas id="{{canvasId}}" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
scope.canvasId='chart_'+Math.random().toString(36).substr(2,9);
var ctx=null;
var chart=null;
scope.$watch('chartData',function(newData){
if(newData){
if(!ctx){
var canvas=element.find('canvas')[0];
ctx=canvas.getContext('2d');
}
if(chart){
chart.destroy();
}
var chartType=scope.chartType||'line';
chart=new Chart(ctx,{type:chartType,data:newData,options:{responsive:true,maintainAspectRatio:true,scales:chartType==='line'?{yAxes:[{ticks:{beginAtZero:true}}]}:undefined}});
}
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
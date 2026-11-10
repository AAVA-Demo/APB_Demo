(function(){
'use strict';
angular.module('app.analytics').directive('spendingChart',[function(){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@'},
template:'<canvas id="{{canvasId}}" width="400" height="250"></canvas>',
link:function(scope,element,attrs){
scope.canvasId='chart_'+Math.random().toString(36).substr(2,9);
var chart=null;
scope.$watch('chartData',function(newData){
if(newData){
var ctx=document.getElementById(scope.canvasId);
if(ctx){
if(chart){chart.destroy();}
chart=new Chart(ctx,{type:scope.chartType,data:newData,options:newData.options||{}});
}
}
});
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}
};
}]);
})();
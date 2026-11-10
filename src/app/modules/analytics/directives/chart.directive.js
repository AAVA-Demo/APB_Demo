(function(){
'use strict';
angular.module('analyticsModule').directive('chartDirective',[function(){
return{restrict:'E',scope:{chartData:'=',chartType:'@',chartOptions:'='},link:function(scope,element,attrs){
var canvas=document.createElement('canvas');
element.append(canvas);
var ctx=canvas.getContext('2d');
var chart=null;
scope.$watch('chartData',function(newData){
if(newData){
if(chart){chart.destroy();}
var config={type:scope.chartType||'bar',data:newData,options:scope.chartOptions||{responsive:true,maintainAspectRatio:true}};
chart=new Chart(ctx,config);
}
});
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]);
})();
(function(){
'use strict';
angular.module('app.analytics').directive('chartDirective',['$timeout',function($timeout){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@',chartLabels:'='},
template:'<canvas id="{{canvasId}}" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
scope.canvasId='chart_'+Math.random().toString(36).substr(2,9);
var chart=null;
scope.$watch('chartData',function(newData){
if(!newData)return;
$timeout(function(){
var ctx=document.getElementById(scope.canvasId);
if(!ctx)return;
if(chart)chart.destroy();
var config={type:scope.chartType||'bar',data:{labels:scope.chartLabels||[],datasets:[{label:'Amount (₹)',data:newData,backgroundColor:'rgba(54,162,235,0.6)',borderColor:'rgba(54,162,235,1)',borderWidth:1}]},options:{responsive:true,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
chart=new Chart(ctx,config);
},100);
});
}
};
}]);
})();
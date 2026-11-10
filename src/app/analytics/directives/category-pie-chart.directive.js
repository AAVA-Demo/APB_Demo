(function(){
'use strict';
angular.module('analyticsModule').directive('categoryPieChart',['chartConfigFactory','$timeout',function(chartConfigFactory,$timeout){
return{restrict:'E',scope:{data:'='},template:'<canvas id="categoryPieCanvas" width="400" height="200"></canvas>',link:function(scope,element){
var chartInstance=null;
function renderChart(){
if(chartInstance){chartInstance.destroy();}
var canvas=element.find('canvas')[0];
var ctx=canvas.getContext('2d');
var labels=scope.data.map(function(item){return item.category;});
var values=scope.data.map(function(item){return item.amount;});
var config=chartConfigFactory.getPieChartConfig(labels,values);
chartInstance=new Chart(ctx,config);}
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
$timeout(renderChart,100);}});
scope.$on('$destroy',function(){
if(chartInstance){chartInstance.destroy();}});}};
}]);
})();
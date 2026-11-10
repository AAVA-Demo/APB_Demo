(function(){
'use strict';
angular.module('analyticsModule').directive('chartDirective',[function(){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@',onDrillDown:'&'},
template:'<canvas id="{{chartId}}"></canvas>',
link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
var ctx=null;
var chartInstance=null;
scope.$watch('chartData',function(newData){
if(newData){
renderChart(newData);
}
});
function renderChart(data){
if(chartInstance){
chartInstance.destroy();
}
setTimeout(function(){
ctx=document.getElementById(scope.chartId);
if(!ctx)return;
var config=buildChartConfig(data,scope.chartType);
chartInstance=new Chart(ctx,config);
},100);
}
function buildChartConfig(data,type){
var config={type:type||'line',data:data,options:{responsive:true,maintainAspectRatio:true,onClick:function(evt,items){
if(items.length>0&&scope.onDrillDown){
var index=items[0]._index;
var label=config.data.labels[index];
scope.onDrillDown({category:label});
scope.$apply();
}
}}};
return config;
}
}
};
}]);
})();
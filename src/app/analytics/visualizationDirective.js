angular.module('analyticsModule').directive('visualizationChart',['$timeout',function($timeout){
return{
restrict:'E',
scope:{data:'=',type:'@'},
template:'<canvas id="{{chartId}}" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
$timeout(function(){
var ctx=document.getElementById(scope.chartId);
if(ctx&&scope.data){
var chartData={
labels:scope.data.map(function(d){return d.category||d.month||d.cardId;}),
datasets:[{label:'Amount',data:scope.data.map(function(d){return d.totalAmount||d.totalSpend;}),backgroundColor:'rgba(54,162,235,0.6)'}]
};
new Chart(ctx,{type:scope.type||'bar',data:chartData});
}
},500);
}
};
}]);
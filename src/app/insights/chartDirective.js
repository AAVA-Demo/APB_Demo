angular.module('insightsModule').directive('insightChart',['$timeout',function($timeout){
return{
restrict:'E',
scope:{data:'=',chartType:'@'},
template:'<canvas id="{{chartId}}" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
scope.chartId='insight-chart-'+Math.random().toString(36).substr(2,9);
$timeout(function(){
var ctx=document.getElementById(scope.chartId);
if(ctx&&scope.data){
var chartData={
labels:scope.data.map(function(d){return d.category||d.month;}),
datasets:[{label:'Spending',data:scope.data.map(function(d){return d.amount||d.totalSpend;}),backgroundColor:'rgba(75,192,192,0.6)'}]
};
new Chart(ctx,{type:scope.chartType||'bar',data:chartData});
}
},500);
}
};
}]);
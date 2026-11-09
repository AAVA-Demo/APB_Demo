(function(){
'use strict';
angular.module('analyticsModule').directive('trendChart',['$timeout',function($timeout){
return{restrict:'E',scope:{data:'='},template:'<canvas id="trendChart"></canvas>',link:function(scope,element){
var canvas=element.find('canvas')[0];
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
$timeout(function(){
var labels=newData.map(function(d){return d.month;});
var amounts=newData.map(function(d){return d.totalSpend;});
if(chart)chart.destroy();
var ctx=canvas.getContext('2d');
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:amounts,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value.toFixed(2);}}}]}}});
},0);
}
});
scope.$on('$destroy',function(){
if(chart)chart.destroy();
});
}};
}]);
})();
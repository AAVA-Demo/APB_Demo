(function(){
'use strict';
angular.module('trendAnalysisModule').directive('trendChart',[function(){
return{
restrict:'E',
scope:{chartData:'='},
template:'<canvas id="trendChart" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('chartData',function(newVal){
if(newVal&&newVal.labels&&newVal.labels.length>0){
if(chart){
chart.destroy();
}
chart=new Chart(ctx,{type:'line',data:newVal,options:{responsive:true,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
});
}
};
}]);
})();
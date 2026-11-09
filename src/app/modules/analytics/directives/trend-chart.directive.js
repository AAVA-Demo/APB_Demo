(function(){
'use strict';
angular.module('analyticsModule').directive('trendChart',['$window',function($window){
return{
restrict:'E',
scope:{data:'='},
template:'<canvas id="trendChart" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
let chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
const ctx=element.find('canvas')[0].getContext('2d');
if(chart)chart.destroy();
const labels=newData.map(function(d){return d.month;});
const values=newData.map(function(d){return d.totalSpend;});
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:values,borderColor:'#36A2EB',fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
},true);
angular.element($window).on('resize',function(){
if(chart)chart.resize();
});
scope.$on('$destroy',function(){
if(chart)chart.destroy();
});
}
};
}]);
})();
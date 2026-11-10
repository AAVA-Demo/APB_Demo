(function(){
'use strict';
angular.module('app.creditCard.analytics').directive('spendTrendLine',spendTrendLine);
function spendTrendLine(){
return{
restrict:'E',
scope:{data:'='},
template:'<canvas id="spendTrendLineCanvas" width="400" height="200"></canvas>',
link:function(scope,element){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
renderChart(newData);
}
});
function renderChart(data){
var labels=data.map(function(d){return d.period;});
var amounts=data.map(function(d){return d.totalSpend;});
if(chart){chart.destroy();}
chart=new Chart(ctx,{
type:'line',
data:{
labels:labels,
datasets:[{label:'Total Spend',data:amounts,borderColor:'rgba(54,162,235,1)',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]
},
options:{responsive:true,scales:{y:{beginAtZero:true}}}
});}
}
};
}
})();
(function(){
'use strict';
angular.module('app.creditCard.multiCard').directive('spendTrendChart',spendTrendChart);
function spendTrendChart(){
return{
restrict:'E',
scope:{card:'='},
template:'<canvas id="spendTrendCanvas" width="400" height="200"></canvas>',
link:function(scope,element){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('card',function(newCard){
if(newCard&&newCard.monthlyTrends){
renderChart(newCard.monthlyTrends);
}
});
function renderChart(trends){
var labels=trends.map(function(t){return t.month;});
var data=trends.map(function(t){return t.totalSpend;});
if(chart){chart.destroy();}
chart=new Chart(ctx,{
type:'line',
data:{
labels:labels,
datasets:[{label:'Monthly Spend',data:data,borderColor:'rgba(75,192,192,1)',backgroundColor:'rgba(75,192,192,0.2)',fill:true}]
},
options:{responsive:true,scales:{y:{beginAtZero:true}}}
});}
}
};
}
})();
(function(){
'use strict';
angular.module('app.creditCard.analytics').directive('categorySpendChart',categorySpendChart);
function categorySpendChart(){
return{
restrict:'E',
scope:{data:'='},
template:'<canvas id="categorySpendCanvas" width="400" height="400"></canvas>',
link:function(scope,element){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
scope.$watch('data',function(newData){
if(newData&&newData.length>0){
renderChart(newData);
}
});
function renderChart(data){
var labels=data.map(function(d){return d.category;});
var amounts=data.map(function(d){return d.totalAmount;});
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
if(chart){chart.destroy();}
chart=new Chart(ctx,{
type:'doughnut',
data:{
labels:labels,
datasets:[{data:amounts,backgroundColor:colors}]
},
options:{responsive:true,plugins:{legend:{position:'bottom'}}}
});}
}
};
}
})();
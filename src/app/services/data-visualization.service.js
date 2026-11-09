(function(){
'use strict';
angular.module('creditCardApp').service('DataVisualizationService',[function(){
var self=this;
self.renderCategoryChart=function(canvasId,data){
var ctx=document.getElementById(canvasId).getContext('2d');
var labels=data.map(function(d){return d.category;});
var values=data.map(function(d){return d.totalSpend;});
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
new Chart(ctx,{
type:'bar',
data:{
labels:labels,
datasets:[{
label:'Spending by Category',
data:values,
backgroundColor:colors
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{yAxes:[{ticks:{beginAtZero:true}}]}
}
});
};
self.renderTrendChart=function(canvasId,data){
var ctx=document.getElementById(canvasId).getContext('2d');
var labels=data.map(function(d){return d.month;});
var values=data.map(function(d){return d.totalSpend;});
new Chart(ctx,{
type:'line',
data:{
labels:labels,
datasets:[{
label:'Monthly Spend Trend',
data:values,
borderColor:'#007bff',
backgroundColor:'rgba(0,123,255,0.1)',
fill:true
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{yAxes:[{ticks:{beginAtZero:true}}]}
}
});
};
}]);
})();
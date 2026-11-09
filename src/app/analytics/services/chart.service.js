(function(){
'use strict';
angular.module('creditCard.analytics').factory('ChartService',[function(){
const service={};
service.renderCategoryChart=function(canvasId,categorySpending){
const ctx=document.getElementById(canvasId).getContext('2d');
const labels=categorySpending.map(c=>c.category);
const data=categorySpending.map(c=>c.totalAmount);
const backgroundColors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
return new Chart(ctx,{type:'doughnut',data:{labels:labels,datasets:[{data:data,backgroundColor:backgroundColors}]},options:{responsive:true,maintainAspectRatio:true,legend:{position:'bottom'}}});
};
service.renderTrendChart=function(canvasId,monthlyTrends){
const ctx=document.getElementById(canvasId).getContext('2d');
const labels=monthlyTrends.map(t=>t.month);
const data=monthlyTrends.map(t=>t.totalSpend);
return new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:data,borderColor:'#36A2EB',backgroundColor:'rgba(54,162,235,0.2)',fill:true}]},options:{responsive:true,maintainAspectRatio:true,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value.toLocaleString();}}}]}}});
};
service.destroyChart=function(chart){
if(chart)chart.destroy();
};
return service;
}]);
})();
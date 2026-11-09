(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',function(){
return{
restrict:'E',
scope:{data:'=',chartType:'@'},
template:'<canvas id="{{canvasId}}" width="400" height="200"></canvas>',
link:function(scope,element,attrs){
scope.canvasId='chart-'+Math.random().toString(36).substr(2,9);
scope.$watch('data',function(newData){
if(newData){
scope.renderChart(newData);
}
});
scope.renderChart=function(data){
const canvas=element.find('canvas')[0];
const ctx=canvas.getContext('2d');
if(scope.chartInstance){
scope.chartInstance.destroy();
}
if(scope.chartType==='pie'){
const labels=data.map(d=>d.category);
const values=data.map(d=>d.totalAmount);
scope.chartInstance=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:values,backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:false}});
}else if(scope.chartType==='line'){
const labels=data.map(d=>d.month);
const values=data.map(d=>d.totalSpend);
scope.chartInstance=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Monthly Spend',data:values,borderColor:'#36A2EB',fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
};
}
};
});
})();
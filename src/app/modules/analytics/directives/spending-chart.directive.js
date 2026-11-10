(function(){
'use strict';
angular.module('creditCard.analytics').directive('spendingChart',[function(){
return{restrict:'E',scope:{chartData:'=',chartType:'@',chartTitle:'@'},template:'<div class="chart-container"><h4>{{chartTitle}}</h4><canvas id="{{canvasId}}"></canvas></div>',link:function(scope,element,attrs){
scope.canvasId='chart-'+Math.random().toString(36).substr(2,9);
let chart=null;
scope.$watch('chartData',function(newData){
if(!newData)return;
const canvas=element.find('canvas')[0];
if(!canvas)return;
const ctx=canvas.getContext('2d');
if(chart)chart.destroy();
let config={};
if(scope.chartType==='category'){
config={type:'pie',data:{labels:newData.map(function(d){return d.category;}),datasets:[{data:newData.map(function(d){return d.amount;}),backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0']}]},options:{responsive:true,maintainAspectRatio:true}};
}else if(scope.chartType==='monthly'){
config={type:'line',data:{labels:newData.map(function(d){return d.month+' '+d.year;}),datasets:[{label:'Monthly Spend',data:newData.map(function(d){return d.amount;}),borderColor:'#36A2EB',fill:false}]},options:{responsive:true,maintainAspectRatio:true,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}else if(scope.chartType==='card'){
config={type:'bar',data:{labels:newData.map(function(d){return d.cardName;}),datasets:[{label:'Card-wise Spend',data:newData.map(function(d){return d.amount;}),backgroundColor:'#4BC0C0'}]},options:{responsive:true,maintainAspectRatio:true,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}};
}
chart=new Chart(ctx,config);
},true);
}};
}]);
})();
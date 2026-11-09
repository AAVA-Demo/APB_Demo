(function(){
'use strict';
angular.module('spendTrendsModule').directive('trendChart',[function(){
return{
restrict:'E',
scope:{trends:'=',cardData:'=',selectedCard:'='},
template:'<canvas id="trendChart" width="600" height="300"></canvas>',
link:function(scope,element,attrs){
var ctx=element.find('canvas')[0].getContext('2d');
var chart=null;
function renderChart(){
var data=scope.selectedCard?scope.cardData.find(function(c){return c.cardId===scope.selectedCard;}):null;
var labels=[];
var values=[];
if(data&&data.monthlyData){
labels=data.monthlyData.map(function(m){return m.month;});
values=data.monthlyData.map(function(m){return m.spend;});
}else if(scope.trends){
labels=scope.trends.map(function(t){return t.month;});
values=scope.trends.map(function(t){return t.totalSpend;});
}
if(chart){chart.destroy();}
chart=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Spending',data:values,borderColor:'#36A2EB',fill:false}]},options:{responsive:true,scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
}
scope.$watch('trends',renderChart,true);
scope.$watch('selectedCard',renderChart);
}
};
}]);
})();
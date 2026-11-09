(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',['$scope','AnalyticsService',function($scope,AnalyticsService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.insights=null;
vm.monthlyTrendData=null;
vm.cardWiseData=null;
vm.categoryWiseData=null;
vm.retry=retry;
function init(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingInsights().then(function(insights){
vm.insights=insights;
prepareChartData(insights);
vm.loading=false;
}).catch(function(error){
vm.error=error.message||'Failed to load analytics data';
vm.loading=false;
});
}
function prepareChartData(insights){
vm.monthlyTrendData={
labels:insights.monthlyTrends.map(function(item){return item.month;}),
data:[insights.monthlyTrends.map(function(item){return item.amount;})],
series:['Monthly Spend'],
options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value;}}}]}}
};
vm.cardWiseData={
labels:insights.cardWiseSpend.map(function(item){return item.cardName;}),
data:[insights.cardWiseSpend.map(function(item){return item.amount;})],
series:['Card Spend'],
options:{responsive:true,maintainAspectRatio:false,scales:{yAxes:[{ticks:{beginAtZero:true,callback:function(value){return'$'+value;}}}]}}
};
vm.categoryWiseData={
labels:insights.categoryWiseSpend.map(function(item){return item.category;}),
data:insights.categoryWiseSpend.map(function(item){return item.amount;}),
options:{responsive:true,maintainAspectRatio:false,legend:{display:true,position:'right'},tooltips:{callbacks:{label:function(tooltipItem,data){const label=data.labels[tooltipItem.index]||'';const value=data.datasets[0].data[tooltipItem.index]||0;const total=data.datasets[0].data.reduce(function(a,b){return a+b;},0);const percentage=((value/total)*100).toFixed(1);return label+': $'+value+' ('+percentage+'%)';}}}
}
};
}
function retry(){
init();
}
init();
}]);
})();
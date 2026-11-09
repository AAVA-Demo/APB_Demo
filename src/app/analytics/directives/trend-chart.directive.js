(function(){
'use strict';
angular.module('app.analytics').directive('trendChart',['ChartFactory',function(ChartFactory){
return{restrict:'E',scope:{analyticsData:'='},template:'<canvas id="trendChart" width="400" height="300"></canvas>',link:function(scope,element){
let chart=null;
scope.$on('analyticsDataLoaded',function(event,data){
if(chart){chart.destroy();}
const ctx=element.find('canvas')[0].getContext('2d');
const labels=data.monthlyTrends.map(function(m){return m.month;});
const amounts=data.monthlyTrends.map(function(m){return m.totalSpend;});
chart=ChartFactory.createLineChart(ctx,amounts,labels);
});
if(scope.analyticsData){
const ctx=element.find('canvas')[0].getContext('2d');
const labels=scope.analyticsData.monthlyTrends.map(function(m){return m.month;});
const amounts=scope.analyticsData.monthlyTrends.map(function(m){return m.totalSpend;});
chart=ChartFactory.createLineChart(ctx,amounts,labels);
}
scope.$on('$destroy',function(){
if(chart){chart.destroy();}
});
}};
}]);
})();
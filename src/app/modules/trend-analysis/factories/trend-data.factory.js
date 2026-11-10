(function(){
'use strict';
angular.module('trendAnalysisModule').factory('TrendDataFactory',[function(){
return{
computeMoMComparison:function(monthlySpends){
if(monthlySpends.length<2){
return null;
}
var current=monthlySpends[monthlySpends.length-1];
var previous=monthlySpends[monthlySpends.length-2];
var percentageChange=0;
if(previous.totalSpend>0){
percentageChange=((current.totalSpend-previous.totalSpend)/previous.totalSpend)*100;
}
var trend='stable';
if(percentageChange>5)trend='up';
else if(percentageChange<-5)trend='down';
return{currentMonth:current.month,currentSpend:current.totalSpend,previousMonth:previous.month,previousSpend:previous.totalSpend,percentageChange:percentageChange,trend:trend};
}
};
}]);
})();
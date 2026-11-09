(function(){
'use strict';
angular.module('spendTrendsModule').factory('TimeSeriesAggregator',[function(){
return{
aggregateByMonth:function(transactions){
var monthMap={};
transactions.forEach(function(txn){
var date=new Date(txn.transactionDate);
var monthKey=date.getFullYear()+'-'+(''+(date.getMonth()+1)).padStart(2,'0');
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,transactionCount:0,cardBreakdown:{}};
}
monthMap[monthKey].totalSpend+=txn.amount;
monthMap[monthKey].transactionCount++;
if(!monthMap[monthKey].cardBreakdown[txn.cardId]){
monthMap[monthKey].cardBreakdown[txn.cardId]={cardId:txn.cardId,spend:0};
}
monthMap[monthKey].cardBreakdown[txn.cardId].spend+=txn.amount;
});
var monthlyTrends=Object.keys(monthMap).sort().map(function(key){
var month=monthMap[key];
month.cardBreakdown=Object.values(month.cardBreakdown);
return month;
});
return monthlyTrends;
}
};
}]);
})();
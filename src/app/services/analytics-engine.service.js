(function(){
'use strict';
angular.module('creditCardApp').service('AnalyticsEngine',['TransactionService','$q',function(TransactionService,$q){
var self=this;
self.getInsights=function(userId,dateRange){
var range=dateRange||{months:12};
return TransactionService.fetchTransactions(userId,range).then(function(transactions){
var categoryInsights=aggregateByCategory(transactions);
var monthlyTrends=aggregateByMonth(transactions);
return{
categoryInsights:categoryInsights,
monthlyTrends:monthlyTrends
};
});
};
self.getSpendingAnalytics=function(userId,dateRange){
return self.getInsights(userId,dateRange);
};
function aggregateByCategory(transactions){
var categoryMap={};
var total=0;
transactions.forEach(function(txn){
if(!categoryMap[txn.category]){
categoryMap[txn.category]={category:txn.category,totalSpend:0,transactionCount:0};
}
categoryMap[txn.category].totalSpend+=txn.amount;
categoryMap[txn.category].transactionCount++;
total+=txn.amount;
});
var insights=[];
for(var cat in categoryMap){
var item=categoryMap[cat];
item.percentageOfTotal=total>0?(item.totalSpend/total*100).toFixed(2):0;
insights.push(item);
}
return insights;
}
function aggregateByMonth(transactions){
var monthMap={};
transactions.forEach(function(txn){
var date=new Date(txn.transactionDate);
var monthKey=date.getFullYear()+'-'+(date.getMonth()+1<10?'0':'')+(date.getMonth()+1);
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,categoryBreakdown:{}};
}
monthMap[monthKey].totalSpend+=txn.amount;
if(!monthMap[monthKey].categoryBreakdown[txn.category]){
monthMap[monthKey].categoryBreakdown[txn.category]=0;
}
monthMap[monthKey].categoryBreakdown[txn.category]+=txn.amount;
});
var trends=[];
for(var m in monthMap){
var breakdown=[];
for(var c in monthMap[m].categoryBreakdown){
breakdown.push({category:c,amount:monthMap[m].categoryBreakdown[c]});
}
trends.push({month:m,totalSpend:monthMap[m].totalSpend,categoryBreakdown:breakdown});
}
trends.sort(function(a,b){return a.month.localeCompare(b.month);});
return trends;
}
}]);
})();
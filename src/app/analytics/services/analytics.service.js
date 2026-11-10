(function(){
'use strict';
angular.module('app.analytics').service('AnalyticsService',['TransactionDataFactory','CacheService','$q',function(TransactionDataFactory,CacheService,$q){
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
function aggregateByCategory(transactions){
var categorySpending={};
categories.forEach(function(cat){categorySpending[cat]=0;});
transactions.forEach(function(txn){
if(categorySpending.hasOwnProperty(txn.category)){
categorySpending[txn.category]+=txn.amount;
}
});
for(var cat in categorySpending){
categorySpending[cat]=parseFloat(categorySpending[cat].toFixed(2));
}
return categorySpending;
}
function calculateMonthlyTrends(transactions){
var monthMap={};
transactions.forEach(function(txn){
var date=new Date(txn.transactionDate);
var monthKey=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0');
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,categoryBreakdown:{}};
categories.forEach(function(cat){monthMap[monthKey].categoryBreakdown[cat]=0;});
}
monthMap[monthKey].totalSpend+=txn.amount;
if(monthMap[monthKey].categoryBreakdown.hasOwnProperty(txn.category)){
monthMap[monthKey].categoryBreakdown[txn.category]+=txn.amount;
}
});
var trends=[];
for(var key in monthMap){
var trend=monthMap[key];
trend.totalSpend=parseFloat(trend.totalSpend.toFixed(2));
for(var cat in trend.categoryBreakdown){
trend.categoryBreakdown[cat]=parseFloat(trend.categoryBreakdown[cat].toFixed(2));
}
trends.push(trend);
}
trends.sort(function(a,b){return a.month.localeCompare(b.month);});
return trends;
}
this.getSpendingAnalytics=function(timeRange,filterCategory){
var cacheKey='analytics_'+(filterCategory||'all')+'_'+JSON.stringify(timeRange);
var cached=CacheService.getSession(cacheKey);
if(cached)return $q.resolve(cached);
var deferred=$q.defer();
var startDate=timeRange?timeRange.startDate:new Date(new Date().setFullYear(new Date().getFullYear()-1));
var endDate=timeRange?timeRange.endDate:new Date();
TransactionDataFactory.fetchTransactions(startDate,endDate).then(function(transactions){
var filtered=filterCategory?transactions.filter(function(t){return t.category===filterCategory;}):transactions;
var categorySpending=aggregateByCategory(filtered);
var monthlyTrends=calculateMonthlyTrends(filtered);
var analytics={categorySpending:categorySpending,monthlyTrends:monthlyTrends,timeRange:{startDate:startDate,endDate:endDate}};
CacheService.setSession(cacheKey,analytics);
deferred.resolve(analytics);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
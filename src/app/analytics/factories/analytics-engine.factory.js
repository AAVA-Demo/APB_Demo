(function(){
'use strict';
angular.module('app.creditCard.analytics').factory('AnalyticsEngineFactory',AnalyticsEngineFactory);
function AnalyticsEngineFactory(){
var factory={aggregateByCategory:aggregateByCategory};
return factory;
function aggregateByCategory(transactions,selectedCategories){
var categoryMap={};
var totalSpend=0;
var trendMap={};
transactions.forEach(function(txn){
if(selectedCategories.indexOf(txn.category)===-1){return;}
if(!categoryMap[txn.category]){
categoryMap[txn.category]={category:txn.category,totalAmount:0,transactionCount:0};
}
categoryMap[txn.category].totalAmount+=txn.amount;
categoryMap[txn.category].transactionCount++;
totalSpend+=txn.amount;
var period=txn.transactionDate.substring(0,7);
if(!trendMap[period]){
trendMap[period]={period:period,categoryBreakdown:[],totalSpend:0};
}
trendMap[period].totalSpend+=txn.amount;
});
var categoryBreakdown=Object.keys(categoryMap).map(function(cat){
var item=categoryMap[cat];
item.percentage=totalSpend>0?((item.totalAmount/totalSpend)*100).toFixed(2):0;
return item;
});
var trendData=Object.keys(trendMap).map(function(period){
return trendMap[period];
}).sort(function(a,b){
return a.period.localeCompare(b.period);
});
return{categoryBreakdown:categoryBreakdown,trendData:trendData,totalSpend:totalSpend};
}
}
})();
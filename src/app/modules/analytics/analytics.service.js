(function(){
'use strict';
angular.module('app.analytics').service('AnalyticsService',AnalyticsService);
AnalyticsService.$inject=['TransactionDataService','CategorizationService','$q'];
function AnalyticsService(TransactionDataService,CategorizationService,$q){
var service=this;
service.getSpendingInsights=getSpendingInsights;
function getSpendingInsights(months,cardId){
return TransactionDataService.getTransactions(months,cardId).then(function(transactions){
var categorized=CategorizationService.categorizeTransactions(transactions);
var insights=aggregateInsights(categorized);
return insights;
});
}
function aggregateInsights(transactions){
var categoryMap={};
var monthMap={};
var cardMap={};
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
categories.forEach(function(cat){
categoryMap[cat]={category:cat,totalAmount:0,transactionCount:0,percentage:0};
});
transactions.forEach(function(txn){
var cat=txn.category||'Miscellaneous';
if(categoryMap[cat]){
categoryMap[cat].totalAmount+=txn.amount;
categoryMap[cat].transactionCount++;
}
var month=txn.transactionDate.substring(0,7);
if(!monthMap[month]){
monthMap[month]={month:month,totalSpend:0,categoryBreakdown:[]};
}
monthMap[month].totalSpend+=txn.amount;
if(!cardMap[txn.cardId]){
cardMap[txn.cardId]={cardId:txn.cardId,totalSpend:0,categories:{}};
}
cardMap[txn.cardId].totalSpend+=txn.amount;
});
var totalSpend=Object.values(categoryMap).reduce(function(sum,c){return sum+c.totalAmount;},0);
Object.values(categoryMap).forEach(function(c){
c.percentage=totalSpend>0?(c.totalAmount/totalSpend*100).toFixed(2):0;
});
var topCategory=Object.values(categoryMap).reduce(function(max,c){return c.totalAmount>max.totalAmount?c:max;},{totalAmount:0});
return{categorySpends:Object.values(categoryMap),monthlyTrends:Object.values(monthMap).sort(function(a,b){return a.month.localeCompare(b.month);}),cardWiseSpend:Object.values(cardMap),topCategory:topCategory.category,totalSpend:totalSpend};
}
}
})();
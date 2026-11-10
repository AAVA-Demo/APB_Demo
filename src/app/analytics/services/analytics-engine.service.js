(function(){
'use strict';
angular.module('spendingAnalytics').service('AnalyticsEngineService',AnalyticsEngineService);
AnalyticsEngineService.$inject=[];
function AnalyticsEngineService(){
var vm=this;
vm.aggregateByCategory=aggregateByCategory;
function aggregateByCategory(transactions){
var categoryMap={};
var cardMap={};
var monthMap={};
var totalAmount=0;
transactions.forEach(function(txn){
totalAmount+=txn.amount;
if(!categoryMap[txn.category]){
categoryMap[txn.category]={category:txn.category,totalAmount:0,transactionCount:0};
}
categoryMap[txn.category].totalAmount+=txn.amount;
categoryMap[txn.category].transactionCount++;
if(!cardMap[txn.cardId]){
cardMap[txn.cardId]={cardId:txn.cardId,amount:0};
}
cardMap[txn.cardId].amount+=txn.amount;
var month=txn.date.substring(0,7);
if(!monthMap[month]){
monthMap[month]={month:month,amount:0};
}
monthMap[month].amount+=txn.amount;
});
var categoryBreakdown=Object.values(categoryMap).map(function(cat){
cat.percentageOfTotal=totalAmount>0?((cat.totalAmount/totalAmount)*100).toFixed(2):0;
return cat;
});
var cardWiseSpending=Object.values(cardMap);
var timeSeriesData=Object.values(monthMap).sort(function(a,b){
return a.month.localeCompare(b.month);
});
return{categoryBreakdown:categoryBreakdown,cardWiseSpending:cardWiseSpending,timeSeriesData:timeSeriesData};
}
}
})();
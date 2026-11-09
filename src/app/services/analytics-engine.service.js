(function(){
'use strict';
angular.module('analyticsModule').service('AnalyticsEngineService',['TransactionFactory','CategoryFactory','$q',function(TransactionFactory,CategoryFactory,$q){
var self=this;
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
self.getAnalytics=function(timeRange){
var deferred=$q.defer();
var months=12;
if(timeRange==='Last 3 months')months=3;
if(timeRange==='Last 6 months')months=6;
var endDate=new Date();
var startDate=new Date();
startDate.setMonth(startDate.getMonth()-months);
$q.all([TransactionFactory.getTransactions(startDate,endDate),CategoryFactory.getCategoryMappings()]).then(function(results){
var transactions=results[0];
var categoryMap=results[1];
var categorySpending={};
categories.forEach(function(cat){
categorySpending[cat]={categoryName:cat,totalAmount:0,transactionCount:0,percentage:0};
});
var totalSpending=0;
transactions.forEach(function(txn){
var catName=categoryMap[txn.categoryId]||'Miscellaneous';
if(categorySpending[catName]){
categorySpending[catName].totalAmount+=txn.amount;
categorySpending[catName].transactionCount++;
totalSpending+=txn.amount;
}
});
for(var cat in categorySpending){
if(totalSpending>0){
categorySpending[cat].percentage=(categorySpending[cat].totalAmount/totalSpending)*100;
}
}
var monthlyTrends=[];
for(var i=0;i<months;i++){
var monthDate=new Date(startDate);
monthDate.setMonth(monthDate.getMonth()+i);
var monthKey=monthDate.getFullYear()+'-'+('0'+(monthDate.getMonth()+1)).slice(-2);
var monthTransactions=transactions.filter(function(txn){
var txnDate=new Date(txn.date);
return txnDate.getFullYear()===monthDate.getFullYear()&&txnDate.getMonth()===monthDate.getMonth();
});
var monthTotal=monthTransactions.reduce(function(sum,txn){return sum+txn.amount;},0);
monthlyTrends.push({month:monthKey,totalSpend:monthTotal,categoryBreakdown:[]});
}
var analyticsData={timeRange:timeRange,categorySpending:Object.keys(categorySpending).map(function(k){return categorySpending[k];}),monthlyTrends:monthlyTrends,totalSpending:totalSpending};
deferred.resolve(analyticsData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
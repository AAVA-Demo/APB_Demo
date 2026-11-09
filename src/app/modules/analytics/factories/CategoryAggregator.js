(function(){
'use strict';
angular.module('spendingAnalyticsModule').factory('CategoryAggregator',['CategoryConstants',function(CategoryConstants){
return{
aggregateByCategory:function(transactions){
var categoryMap={};
var totalSpend=0;
CategoryConstants.forEach(function(cat){
categoryMap[cat]={category:cat,totalSpend:0,transactionCount:0,percentage:0};
});
transactions.forEach(function(txn){
if(categoryMap[txn.category]){
categoryMap[txn.category].totalSpend+=txn.amount;
categoryMap[txn.category].transactionCount++;
totalSpend+=txn.amount;
}
});
var categoryBreakdown=[];
CategoryConstants.forEach(function(cat){
var catData=categoryMap[cat];
catData.percentage=totalSpend>0?(catData.totalSpend/totalSpend)*100:0;
categoryBreakdown.push(catData);
});
return{categoryBreakdown:categoryBreakdown,totalSpend:totalSpend,period:'Current'};
}
};
}]);
})();
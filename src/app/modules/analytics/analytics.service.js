(function(){
'use strict';
angular.module('analyticsModule').service('AnalyticsService',['TransactionDataFactory','CategoryFactory','DateUtilService','$q',function(TransactionDataFactory,CategoryFactory,DateUtilService,$q){
const self=this;
self.getSpendingAnalytics=function(userId,dateRange){
const range=DateUtilService.calculateMonthRange(dateRange);
const promises={
transactions:TransactionDataFactory.getTransactions({userId:userId,startDate:range.startDate,endDate:range.endDate}).$promise,
categories:CategoryFactory.getCategoryDefinitions().$promise
};
return $q.all(promises).then(function(results){
const transactions=results.transactions;
const categories=results.categories;
const categorySpend=self.aggregateByCategory(transactions,categories);
const monthlyTrends=self.computeMonthlyTrends(transactions,categories);
return{categorySpend:categorySpend,monthlyTrends:monthlyTrends};
});
};
self.aggregateByCategory=function(transactions,categories){
const categoryMap={};
angular.forEach(categories,function(cat){
categoryMap[cat.name]={category:cat.name,totalAmount:0,transactionCount:0,percentage:0};
});
let totalSpend=0;
angular.forEach(transactions,function(txn){
if(categoryMap[txn.category]){
categoryMap[txn.category].totalAmount+=txn.amount;
categoryMap[txn.category].transactionCount++;
totalSpend+=txn.amount;
}
});
angular.forEach(categoryMap,function(cat){
cat.percentage=totalSpend>0?((cat.totalAmount/totalSpend)*100).toFixed(2):0;
});
return Object.values(categoryMap);
};
self.computeMonthlyTrends=function(transactions,categories){
const monthMap={};
angular.forEach(transactions,function(txn){
const month=moment(txn.transactionDate).format('YYYY-MM');
if(!monthMap[month]){
monthMap[month]={month:month,totalSpend:0,categoryBreakdown:{}};
}
monthMap[month].totalSpend+=txn.amount;
if(!monthMap[month].categoryBreakdown[txn.category]){
monthMap[month].categoryBreakdown[txn.category]=0;
}
monthMap[month].categoryBreakdown[txn.category]+=txn.amount;
});
return Object.values(monthMap).sort(function(a,b){
return a.month.localeCompare(b.month);
});
};
}]);
})();
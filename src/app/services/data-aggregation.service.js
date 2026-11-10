(function(){
'use strict';
angular.module('creditCardApp').service('DataAggregationService',['TransactionCategorizationFactory','$q',function(TransactionCategorizationFactory,$q){
const self=this;
self.getSpendingSummary=function(period){
period=period||'12months';
return TransactionCategorizationFactory.fetchTransactions(period).then(function(transactions){
const categoryBreakdown=self.aggregateByCategory(transactions);
const monthlyTrends=self.aggregateByMonth(transactions);
return{
categoryBreakdown:categoryBreakdown,
monthlyTrends:monthlyTrends,
period:{startDate:new Date(new Date().setMonth(new Date().getMonth()-12)),endDate:new Date()}
};
});
};
self.getFilteredData=function(category){
return TransactionCategorizationFactory.fetchTransactions('12months').then(function(transactions){
const filtered=transactions.filter(function(txn){return txn.category===category;});
return self.aggregateByMonth(filtered);
});
};
self.aggregateByCategory=function(transactions){
const categoryMap={};
transactions.forEach(function(txn){
if(!categoryMap[txn.category]){
categoryMap[txn.category]={category:txn.category,totalAmount:0,transactionCount:0};
}
categoryMap[txn.category].totalAmount+=txn.amount;
categoryMap[txn.category].transactionCount++;
});
return Object.values(categoryMap);
};
self.aggregateByMonth=function(transactions){
const monthMap={};
transactions.forEach(function(txn){
const monthKey=txn.date.getFullYear()+'-'+(txn.date.getMonth()+1);
if(!monthMap[monthKey]){
monthMap[monthKey]={month:monthKey,totalSpend:0,categoryData:{}};
}
monthMap[monthKey].totalSpend+=txn.amount;
monthMap[monthKey].categoryData[txn.category]=(monthMap[monthKey].categoryData[txn.category]||0)+txn.amount;
});
return Object.values(monthMap).sort(function(a,b){
return a.month.localeCompare(b.month);});
};
}]);
})();
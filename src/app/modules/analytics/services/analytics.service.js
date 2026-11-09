(function(){
'use strict';
angular.module('creditCard.analytics').service('AnalyticsService',['$q','$cacheFactory','TransactionDataFactory','CategorizationService',function($q,$cacheFactory,TransactionDataFactory,CategorizationService){
const self=this;
const cache=$cacheFactory('analyticsCache');
self.getSpendingInsights=function(months){
const cacheKey='insights_'+months;
const cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
const deferred=$q.defer();
TransactionDataFactory.getTransactions({months:months}).$promise.then(function(transactions){
const categorized=transactions.map(function(txn){
txn.category=CategorizationService.categorize(txn);
return txn;
});
const categorySpending=self.aggregateByCategory(categorized);
const monthlyTrend=self.aggregateByMonth(categorized);
const result={
categorySpending:categorySpending,
monthlyTrend:monthlyTrend,
categories:Object.keys(categorySpending),
allTransactions:categorized
};
cache.put(cacheKey,result);
deferred.resolve(result);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.aggregateByCategory=function(transactions){
return transactions.reduce(function(acc,txn){
const cat=txn.category||'Miscellaneous';
acc[cat]=(acc[cat]||0)+txn.amount;
return acc;
},{});
};
self.aggregateByMonth=function(transactions){
const monthMap={};
transactions.forEach(function(txn){
const date=new Date(txn.transactionDate);
const monthKey=date.toLocaleString('default',{month:'short',year:'numeric'});
monthMap[monthKey]=(monthMap[monthKey]||0)+txn.amount;
});
return Object.keys(monthMap).map(function(month){
return{month:month,total:monthMap[month]};
});
};
}]);
})();
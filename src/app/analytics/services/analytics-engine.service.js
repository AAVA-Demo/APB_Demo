(function(){
'use strict';
angular.module('analyticsModule').service('AnalyticsEngineService',['TransactionCategorizationService','DataWarehouseService','$q',function(TransactionCategorizationService,DataWarehouseService,$q){
var vm=this;
var cache=null;
var cacheTime=null;
var cacheDuration=300000;
vm.getSpendingAnalytics=function(timeRange,categoryFilter){
var deferred=$q.defer();
var now=new Date().getTime();
if(cache&&cacheTime&&(now-cacheTime)<cacheDuration&&!categoryFilter){
deferred.resolve(cache);
return deferred.promise;
}
var promises=[
TransactionCategorizationService.getCategorizedTransactions(timeRange,categoryFilter),
DataWarehouseService.getHistoricalData(timeRange)
];
$q.all(promises).then(function(results){
var categorizedData=results[0];
var historicalData=results[1];
var analytics=aggregateData(categorizedData,historicalData);
if(!categoryFilter){
cache=analytics;
cacheTime=now;
}
deferred.resolve(analytics);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
function aggregateData(categorizedData,historicalData){
var monthlyTrends={};
var categoryBreakdown={};
var cardWiseSpend={};
angular.forEach(categorizedData,function(txn){
var month=new Date(txn.date).toISOString().slice(0,7);
monthlyTrends[month]=(monthlyTrends[month]||0)+txn.amount;
categoryBreakdown[txn.category]=(categoryBreakdown[txn.category]||0)+txn.amount;
cardWiseSpend[txn.cardId]=(cardWiseSpend[txn.cardId]||0)+txn.amount;
});
var totalSpend=Object.values(categoryBreakdown).reduce(function(sum,val){return sum+val;},0);
var categoryArray=Object.keys(categoryBreakdown).map(function(cat){
return{category:cat,amount:categoryBreakdown[cat],percentage:totalSpend>0?(categoryBreakdown[cat]/totalSpend*100).toFixed(2):0};
});
var monthlyArray=Object.keys(monthlyTrends).sort().map(function(month){
return{month:month,amount:monthlyTrends[month]};
});
var cardArray=Object.keys(cardWiseSpend).map(function(cardId){
return{cardId:cardId,cardName:'Card '+cardId.slice(-4),amount:cardWiseSpend[cardId]};
});
return{monthlyTrends:monthlyArray,categoryBreakdown:categoryArray,cardWiseSpend:cardArray};
}
}]);
})();
(function(){
'use strict';
angular.module('analytics').service('analyticsEngineService',['$q','$cacheFactory','transactionHistoryService','categorizationService',function($q,$cacheFactory,transactionHistoryService,categorizationService){
var service=this;
var cache=$cacheFactory('analyticsCache');
service.getAnalytics=getAnalytics;
function getAnalytics(dateRange){
var cacheKey='analytics_'+dateRange.months;
var cachedData=cache.get(cacheKey);
if(cachedData){
var deferred=$q.defer();
deferred.resolve(cachedData);
return deferred.promise;
}
var deferred=$q.defer();
transactionHistoryService.fetchHistory(dateRange.months).then(function(transactions){
categorizationService.categorizeTransactions(transactions).then(function(categorized){
var analyticsData=aggregateData(categorized);
cache.put(cacheKey,analyticsData);
deferred.resolve(analyticsData);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
function aggregateData(transactions){
var categoryMap={};
var monthMap={};
var totalSpend=0;
var categories=['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous'];
angular.forEach(categories,function(cat){
categoryMap[cat]=0;
});
angular.forEach(transactions,function(txn){
var cat=txn.category||'Miscellaneous';
if(categoryMap[cat]!==undefined){
categoryMap[cat]+=txn.amount;
}else{
categoryMap['Miscellaneous']+=txn.amount;
}
totalSpend+=txn.amount;
var monthKey=new Date(txn.transactionDate).toISOString().substring(0,7);
if(!monthMap[monthKey]){
monthMap[monthKey]=0;
}
monthMap[monthKey]+=txn.amount;
});
var categoryBreakdown=[];
angular.forEach(categoryMap,function(amount,category){
if(amount>0){
var percentage=(totalSpend>0)?(amount/totalSpend*100):0;
categoryBreakdown.push({category:category,amount:amount,percentage:percentage});
}
});
var monthlyTrends=[];
angular.forEach(monthMap,function(amount,month){
monthlyTrends.push({month:month,totalSpend:amount});
});
monthlyTrends.sort(function(a,b){
return a.month.localeCompare(b.month);
});
return{
categoryBreakdown:categoryBreakdown,
monthlyTrends:monthlyTrends,
dateRange:null,
totalSpend:totalSpend
};
}
return service;
}]);
})();
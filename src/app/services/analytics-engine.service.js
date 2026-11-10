(function(){
'use strict';
angular.module('creditCardApp')
.service('AnalyticsEngineService',['$q','TransactionApiService','CategoryClassifierFactory',function($q,TransactionApiService,CategoryClassifierFactory){
var self=this;
self.getSpendingAnalytics=function(months){
var deferred=$q.defer();
TransactionApiService.getTransactions(months)
.then(function(transactions){
var categoryBreakdown={
'Food & Dining':0,
'Fuel':0,
'Shopping':0,
'Travel':0,
'Entertainment':0,
'Utilities':0,
'Healthcare':0,
'Education':0,
'Miscellaneous':0
};
var monthlyMap={};
var cardWiseMap={};
transactions.forEach(function(tx){
var cat=CategoryClassifierFactory.classify(tx);
categoryBreakdown[cat]=(categoryBreakdown[cat]||0)+tx.amount;
var monthKey=tx.date.getFullYear()+'-'+String(tx.date.getMonth()+1).padStart(2,'0');
monthlyMap[monthKey]=(monthlyMap[monthKey]||0)+tx.amount;
cardWiseMap[tx.cardId]=(cardWiseMap[tx.cardId]||0)+tx.amount;
});
for(var cat in categoryBreakdown){
categoryBreakdown[cat]=parseFloat(categoryBreakdown[cat].toFixed(2));
}
var monthlyTrends=Object.keys(monthlyMap).sort().map(function(m){
return{month:m,total:parseFloat(monthlyMap[m].toFixed(2))};
});
var cardWiseSpend=Object.keys(cardWiseMap).map(function(cid){
return{cardId:cid,total:parseFloat(cardWiseMap[cid].toFixed(2))};
});
var analytics={
categoryBreakdown:categoryBreakdown,
monthlyTrends:monthlyTrends,
cardWiseSpend:cardWiseSpend
};
deferred.resolve(analytics);
})
.catch(function(err){
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();
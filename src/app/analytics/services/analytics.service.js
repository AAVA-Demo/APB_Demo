(function(){
'use strict';
angular.module('spendingAnalytics').service('AnalyticsService',AnalyticsService);
AnalyticsService.$inject=['TransactionDataFactory','AnalyticsEngineService','$q'];
function AnalyticsService(TransactionDataFactory,AnalyticsEngineService,$q){
var vm=this;
vm.getSpendingAnalytics=getSpendingAnalytics;
function getSpendingAnalytics(dateRange){
var deferred=$q.defer();
TransactionDataFactory.fetchTransactions(dateRange).$promise.then(function(transactions){
var analyticsData=AnalyticsEngineService.aggregateByCategory(transactions);
deferred.resolve(analyticsData);
},function(err){
deferred.reject(err);
});
return deferred.promise;
}
}
})();
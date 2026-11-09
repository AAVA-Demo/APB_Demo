angular.module('analyticsModule').service('analyticsDashboardService',['transactionDataService','categorizationService','reportingEngineService','$q',function(transactionDataService,categorizationService,reportingEngineService,$q){
var service=this;
service.getAnalytics=function(filters){
var deferred=$q.defer();
transactionDataService.getTransactions(filters.dateRange).then(function(response){
var transactions=response.transactions;
categorizationService.categorizeTransactions(transactions).then(function(catResponse){
var categorizedTransactions=catResponse.categorizedTransactions;
$q.all([
reportingEngineService.aggregateByCategory(categorizedTransactions),
reportingEngineService.aggregateByCard(categorizedTransactions),
reportingEngineService.calculateMonthlyTrends(categorizedTransactions)
]).then(function(results){
var analyticsData={
categoryAnalytics:results[0],
cardSpends:results[1],
monthlyTrends:results[2],
dateRange:filters.dateRange
};
deferred.resolve(analyticsData);
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
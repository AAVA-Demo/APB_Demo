angular.module('insightsModule').service('insightsService',['transactionService','categoryService','analyticsEngineService','$q',function(transactionService,categoryService,analyticsEngineService,$q){
var service=this;
service.getAnalytics=function(timeRange){
var deferred=$q.defer();
transactionService.getTransactions(timeRange).then(function(response){
var transactions=response.transactions;
categoryService.getCategoryMappings().then(function(catResponse){
var categories=catResponse.categories;
$q.all([
analyticsEngineService.aggregateByCategory(transactions,categories),
analyticsEngineService.calculateMonthlyTrends(transactions)
]).then(function(results){
var analyticsData={
categorySpending:results[0],
monthlyTrends:results[1],
timeRange:timeRange
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
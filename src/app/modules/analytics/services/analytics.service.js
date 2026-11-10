(function(){
'use strict';
angular.module('analyticsModule').service('AnalyticsService',['TransactionDataService','KPIDataService','DataProcessingService','$q',function(TransactionDataService,KPIDataService,DataProcessingService,$q){
var cachedAnalytics=null;
this.loadAnalytics=function(userId,timeRange){
var deferred=$q.defer();
if(cachedAnalytics){
deferred.resolve(cachedAnalytics);
return deferred.promise;
}
$q.all([TransactionDataService.getTransactions(userId,timeRange||12),KPIDataService.getAggregatedSpend(userId)]).then(function(results){
var transactions=results[0];
var kpis=results[1];
var analyticsData=DataProcessingService.processData(transactions,kpis);
cachedAnalytics=analyticsData;
deferred.resolve(analyticsData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.invalidateCache=function(){
cachedAnalytics=null;
};
}]);
})();
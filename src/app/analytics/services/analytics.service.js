(function(){
'use strict';
angular.module('app.creditCard.analytics').service('AnalyticsService',AnalyticsService);
AnalyticsService.$inject=['$http','$q','TransactionService','AnalyticsEngineFactory'];
function AnalyticsService($http,$q,TransactionService,AnalyticsEngineFactory){
var service={getSpendingAnalytics:getSpendingAnalytics};
return service;
function getSpendingAnalytics(userId,startDate,endDate,selectedCategories){
return TransactionService.getTransactions(userId,startDate,endDate).then(function(transactions){
var analytics=AnalyticsEngineFactory.aggregateByCategory(transactions,selectedCategories);
return analytics;
}).catch(function(error){
return $q.reject(error);
});}
}
})();
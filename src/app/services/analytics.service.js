(function(){
'use strict';
angular.module('creditCard.analytics').service('AnalyticsService',['TransactionDataService','DashboardKPIService','DataAggregationFactory','$q',function(TransactionDataService,DashboardKPIService,DataAggregationFactory,$q){
let cachedData=null;
this.getAnalyticsData=function(dateRange,cardId){
if(cachedData&&!cardId)return $q.resolve(cachedData);
return $q.all([TransactionDataService.fetchTransactions(dateRange),DashboardKPIService.getAggregatedMetrics()]).then(function(results){
let transactions=results[0];
const metrics=results[1];
if(cardId)transactions=transactions.filter(function(txn){return txn.cardId===cardId;});
const categorySpending=DataAggregationFactory.aggregateByCategory(transactions);
const monthlyTrends=DataAggregationFactory.aggregateByMonth(transactions);
const cardWiseSpending=DataAggregationFactory.aggregateByCard(transactions);
const analyticsData={categorySpending:categorySpending,monthlyTrends:monthlyTrends,cardWiseSpending:cardWiseSpending,dateRange:dateRange||{},totalSpend:metrics.totalSpend};
if(!cardId)cachedData=analyticsData;
return analyticsData;
}).catch(function(err){return $q.reject(err);});
};
}]);
})();
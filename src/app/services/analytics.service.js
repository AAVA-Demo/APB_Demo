(function(){
'use strict';
angular.module('creditCardApp')
.service('AnalyticsService',['TransactionDataFactory','TrendCalculationService','$q',function(TransactionDataFactory,TrendCalculationService,$q){
this.getTrends=function(filters){
var deferred=$q.defer();
TransactionDataFactory.fetchTransactions(filters).then(function(transactions){
var trendData=TrendCalculationService.calculateTrends(transactions);
deferred.resolve(trendData);
}).catch(function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
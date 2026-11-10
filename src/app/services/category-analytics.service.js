(function(){
'use strict';
angular.module('creditCardApp')
.service('CategoryAnalyticsService',['TransactionRepositoryFactory','CategorizationService','$q',function(TransactionRepositoryFactory,CategorizationService,$q){
this.getCategoryAnalytics=function(){
var deferred=$q.defer();
TransactionRepositoryFactory.fetchTransactions().then(function(transactions){
var categoryData=CategorizationService.categorizeAndAggregate(transactions);
deferred.resolve(categoryData);
}).catch(function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
(function(){
'use strict';
angular.module('spendTrendsModule').service('TransactionHistoryService',['ApiService','$q',function(ApiService,$q){
var cache=null;
var cacheTime=null;
var CACHE_DURATION=300000;
this.getTransactionHistory=function(months){
var now=Date.now();
if(cache&&cacheTime&&(now-cacheTime)<CACHE_DURATION){
return $q.resolve(cache);
}
var deferred=$q.defer();
ApiService.getTransactions({period:months+'m'}).then(function(transactions){
cache=transactions;
cacheTime=now;
deferred.resolve(transactions);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
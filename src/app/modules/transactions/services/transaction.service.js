(function(){
'use strict';
angular.module('transactionModule').service('TransactionService',['TransactionQueryFactory','TransactionCacheService','KPIDataProviderService','$q',function(TransactionQueryFactory,TransactionCacheService,KPIDataProviderService,$q){
this.getTransactions=function(userId,filters){
var deferred=$q.defer();
var cachedData=TransactionCacheService.get(userId);
if(cachedData){
deferred.resolve(cachedData);
}else{
TransactionQueryFactory.fetchTransactions(userId,filters).then(function(transactions){
TransactionCacheService.put(userId,transactions);
KPIDataProviderService.setTransactionData(transactions);
deferred.resolve(transactions);
},function(error){
deferred.reject(error);
});
}
return deferred.promise;
};
this.getTransactionDetail=function(transactionId,userId){
var deferred=$q.defer();
this.getTransactions(userId,{}).then(function(transactions){
var transaction=transactions.find(function(t){return t.transactionId===transactionId;});
if(transaction){
deferred.resolve(transaction);
}else{
deferred.reject('Transaction not found');
}
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
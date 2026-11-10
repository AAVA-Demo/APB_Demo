(function(){
'use strict';
angular.module('creditCard.transactions').service('TransactionService',['$http','$q','API_CONFIG','$cacheFactory','$timeout',function($http,$q,API_CONFIG,$cacheFactory,$timeout){
var cache=$cacheFactory('transactionCache');
var searchDebounce=null;
this.getTransactions=function(params){
var cacheKey='transactions_'+JSON.stringify(params);
var cached=cache.get(cacheKey);
if(cached){
return $q.resolve(cached);
}
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.TRANSACTIONS;
var config={params:{userId:params.userId,page:params.page,pageSize:params.pageSize},timeout:API_CONFIG.TIMEOUT};
if(params.filters){
if(params.filters.cardIds&&params.filters.cardIds.length>0){
config.params.cardIds=params.filters.cardIds.join(',');
}
if(params.filters.categories&&params.filters.categories.length>0){
config.params.categories=params.filters.categories.join(',');
}
if(params.filters.dateRange&&params.filters.dateRange.startDate){
config.params.startDate=params.filters.dateRange.startDate;
}
if(params.filters.dateRange&&params.filters.dateRange.endDate){
config.params.endDate=params.filters.dateRange.endDate;
}
if(params.filters.amountRange&&params.filters.amountRange.min){
config.params.minAmount=params.filters.amountRange.min;
}
if(params.filters.amountRange&&params.filters.amountRange.max){
config.params.maxAmount=params.filters.amountRange.max;
}
if(params.filters.searchTerm){
config.params.search=params.filters.searchTerm;
}
}
return $http.get(url,config).then(function(response){
var result={transactions:response.data.transactions||[],total:response.data.total||0};
cache.put(cacheKey,result);
return result;
},function(error){
return $q.reject(error);
});
};
this.getTransactionById=function(transactionId){
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.TRANSACTIONS+'/'+transactionId;
return $http.get(url,{timeout:API_CONFIG.TIMEOUT}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
};
}]);
})();
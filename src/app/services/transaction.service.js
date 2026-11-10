(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionService',TransactionService);
TransactionService.$inject=['$http','$q','$cacheFactory'];
function TransactionService($http,$q,$cacheFactory){
var cache=$cacheFactory('transactionCache');
var service={getTransactions:getTransactions,getMonthlySpend:getMonthlySpend,getCardTransactions:getCardTransactions};
return service;
function getTransactions(userId,startDate,endDate){
var cacheKey='trans_'+userId+'_'+startDate+'_'+endDate;
var cached=cache.get(cacheKey);
if(cached){return $q.resolve(cached);}
return $http.get('/api/transactions',{params:{userId:userId,startDate:startDate,endDate:endDate}}).then(function(response){
cache.put(cacheKey,response.data);
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
function getMonthlySpend(userId){
return $http.get('/api/transactions/monthly-summary',{params:{userId:userId}}).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
function getCardTransactions(cardId,period){
var params={period:period||'12months'};
return $http.get('/api/cards/'+cardId+'/transactions',{params:params}).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
}
})();
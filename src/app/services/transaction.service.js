(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
var self=this;
self.getTransactions=function(filterCriteria,page){
var deferred=$q.defer();
var params={page:page||1,pageSize:filterCriteria.pageSize||50};
if(filterCriteria.cardId)params.cardId=filterCriteria.cardId;
if(filterCriteria.startDate)params.startDate=filterCriteria.startDate;
if(filterCriteria.endDate)params.endDate=filterCriteria.endDate;
if(filterCriteria.transactionType)params.transactionType=filterCriteria.transactionType;
$http.get(API_CONFIG.baseUrl+'/transactions',{params:params}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
self.getTransactionById=function(id){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/transactions/'+id).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();
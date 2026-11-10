(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','$q','$httpParamSerializer','API_ENDPOINTS',function($http,$q,$httpParamSerializer,API_ENDPOINTS){
const self=this;
self.getTransactions=function(pageNumber,pageSize,filters){
const params={page:pageNumber||1,size:pageSize||20};
if(filters){
if(filters.startDate)params.startDate=filters.startDate;
if(filters.endDate)params.endDate=filters.endDate;
if(filters.cardId)params.cardId=filters.cardId;
if(filters.minAmount)params.minAmount=filters.minAmount;
if(filters.maxAmount)params.maxAmount=filters.maxAmount;
if(filters.searchText)params.search=filters.searchText;
}
const url=API_ENDPOINTS.transactions+'?'+$httpParamSerializer(params);
return $http.get(url).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});
};
self.getTransactionById=function(transactionId){
return $http.get(API_ENDPOINTS.transactions+'/'+transactionId).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});
};
}]);
})();
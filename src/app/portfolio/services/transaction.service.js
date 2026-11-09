(function(){
'use strict';
angular.module('creditCard.portfolio').factory('TransactionService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const service={};
service.getCardSpending=function(cardId){
const deferred=$q.defer();
$http.get(API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.TRANSACTIONS_SUMMARY,{params:{cardId:cardId}}).then(function(response){
const spendingData=response.data||{cardId:cardId,monthlySpend:0,categoryBreakdown:[],transactionCount:0,lastTransactionDate:null};
deferred.resolve(spendingData);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
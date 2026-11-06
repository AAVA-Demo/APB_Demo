(function(){
'use strict';
angular.module('cardManagementModule').factory('TransactionDataFactory',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
var factory={};
factory.fetchTransactions=function(cardId){
var deferred=$q.defer();
$http.get(API_CONFIG.endpoints.transactions,{params:{cardId:cardId}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();
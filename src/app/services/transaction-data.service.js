(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionDataService',['$http','$q',function($http,$q){
var service={};
service.getRawTransactions=function(userId,params){
var deferred=$q.defer();
var queryParams=angular.extend({userId:userId},params||{});
$http.get('/api/transactions/raw',{params:queryParams}).then(function(response){
deferred.resolve(response.data.transactions||[]);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionService',['$http','$q',function($http,$q){
var service={};
service.getTransactions=function(params){
var deferred=$q.defer();
var queryParams=angular.extend({page:1,size:50},params||{});
$http.get('/api/transactions',{params:queryParams}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return service;
}]);
})();
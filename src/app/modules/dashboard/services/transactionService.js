(function(){
'use strict';
angular.module('dashboard').service('transactionService',['$http','$q',function($http,$q){
var service=this;
service.getMonthlyTransactions=getMonthlyTransactions;
function getMonthlyTransactions(){
var deferred=$q.defer();
$http.get('/api/transactions',{params:{month:'current'}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
}
return service;
}]);
})();
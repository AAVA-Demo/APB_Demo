(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionFactory',['$http','API_CONFIG','$q',function($http,API_CONFIG,$q){
var factory={};
factory.getMonthlyTransactions=function(){
var deferred=$q.defer();
var now=new Date();
var startOfMonth=new Date(now.getFullYear(),now.getMonth(),1);
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.transactions,{params:{start:startOfMonth.toISOString(),end:now.toISOString()}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
factory.getTransactions=function(startDate,endDate){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+API_CONFIG.endpoints.transactions,{params:{start:startDate.toISOString(),end:endDate.toISOString()}}).then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
return factory;
}]);
})();
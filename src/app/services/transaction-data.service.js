(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionDataService',['$http','API_ENDPOINTS','$q',function($http,API_ENDPOINTS,$q){
return{getTransactions:function(startDate,endDate){
var deferred=$q.defer();
var params={start:startDate,end:endDate};
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.transactions,{params:params}).then(function(response){
deferred.resolve(response.data.transactions||[]);},function(error){
console.error('Error fetching transactions:',error);
deferred.reject(error);});
return deferred.promise;}};
}]);
})();
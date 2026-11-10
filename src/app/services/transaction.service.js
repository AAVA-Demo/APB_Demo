(function(){
'use strict';
angular.module('creditCardApp').factory('TransactionService',['$http','API_ENDPOINTS','$q',function($http,API_ENDPOINTS,$q){
return{getMonthlyTransactions:function(){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.monthlyTransactions).then(function(response){
var transactions=response.data.transactions||[];
var monthlySpend=transactions.reduce(function(sum,txn){return sum+(txn.amount||0);},0);
deferred.resolve({monthlySpend:monthlySpend,transactions:transactions});},function(error){
console.error('Error fetching monthly transactions:',error);
deferred.reject(error);});
return deferred.promise;},getCardWiseSpend:function(cardId){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.cardWiseSpend+'/'+cardId+'/spend').then(function(response){
deferred.resolve(response.data);},function(error){
console.error('Error fetching card-wise spend:',error);
deferred.reject(error);});
return deferred.promise;}};
}]);
})();
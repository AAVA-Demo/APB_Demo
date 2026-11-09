(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const self=this;
self.getTransactions=function(filters){
const deferred=$q.defer();
let url=API_CONFIG.baseUrl+'/transactions';
const params=[];
if(filters){
if(filters.cardId)params.push('cardId='+filters.cardId);
if(filters.startDate)params.push('startDate='+filters.startDate);
if(filters.endDate)params.push('endDate='+filters.endDate);
if(filters.searchTerm)params.push('search='+encodeURIComponent(filters.searchTerm));
if(filters.category)params.push('category='+filters.category);
}
if(params.length>0)url+='?'+params.join('&');
$http.get(url,{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getTransactionById=function(transactionId){
const deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/transactions/'+transactionId,{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getMonthlyData=function(){
const deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/transactions/monthly',{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getMockTransactions=function(){
return[{transactionId:'TXN001',cardId:'CC001',merchantName:'Starbucks',transactionDate:new Date('2024-01-15'),amount:45.50,currency:'USD',category:'Food & Dining',status:'Completed',description:'Coffee and breakfast'},{transactionId:'TXN002',cardId:'CC001',merchantName:'Shell Gas Station',transactionDate:new Date('2024-01-14'),amount:60.00,currency:'USD',category:'Fuel',status:'Completed',description:'Fuel refill'},{transactionId:'TXN003',cardId:'CC002',merchantName:'Amazon',transactionDate:new Date('2024-01-13'),amount:120.75,currency:'USD',category:'Shopping',status:'Completed',description:'Electronics purchase'}];
};
}]);
})();
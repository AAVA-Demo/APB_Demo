(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
const self=this;
self.getCards=function(){
const deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/cards',{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getCardById=function(cardId){
const deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/cards/'+cardId,{timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);},function(error){
deferred.reject(error);});
return deferred.promise;
};
self.getMockCards=function(){
return[{cardId:'CC001',cardNumber:'****1234',cardType:'Visa',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,monthlySpend:8500,lastUpdated:new Date()},{cardId:'CC002',cardNumber:'****5678',cardType:'MasterCard',creditLimit:30000,availableCredit:22000,outstandingAmount:8000,monthlySpend:4200,lastUpdated:new Date()}];
};
}]);
})();
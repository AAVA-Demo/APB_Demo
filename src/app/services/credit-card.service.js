(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardService',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var self=this;
var cache=$cacheFactory('creditCardCache');
var CACHE_TTL=900000;
var API_BASE='/api/creditcards';
self.getAllCards=function(){
var cacheKey='allCards';
var cached=cache.get(cacheKey);
if(cached&&(Date.now()-cached.timestamp)<CACHE_TTL){
return $q.resolve(cached.data);
}
return $http.get(API_BASE).then(function(response){
var cards=response.data||self._getMockData();
cache.put(cacheKey,{data:cards,timestamp:Date.now()});
return cards;
},function(error){
return self._getMockData();
});
};
self._getMockData=function(){
return[
{cardId:'CC001',cardNumber:'**** 1234',cardHolderName:'John Doe',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,monthlySpend:8500,lastUpdated:new Date()},
{cardId:'CC002',cardNumber:'**** 5678',cardHolderName:'John Doe',creditLimit:30000,availableCredit:22000,outstandingAmount:8000,monthlySpend:5200,lastUpdated:new Date()},
{cardId:'CC003',cardNumber:'**** 9012',cardHolderName:'John Doe',creditLimit:75000,availableCredit:60000,outstandingAmount:15000,monthlySpend:12300,lastUpdated:new Date()}
];
};
}]);
})();